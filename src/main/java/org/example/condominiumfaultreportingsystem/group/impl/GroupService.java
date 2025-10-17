package org.example.condominiumfaultreportingsystem.group.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.DTO.GroupTestDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRemovedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.CompanyRequestAcceptedEvent;
import org.example.condominiumfaultreportingsystem.eventHandler.events.UserLeftEvent;
import org.example.condominiumfaultreportingsystem.exception.GroupNotFoundException;
import org.example.condominiumfaultreportingsystem.exception.UserNotFoundException;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.example.condominiumfaultreportingsystem.group.IGroupService;
import org.example.condominiumfaultreportingsystem.security.user.User;
import org.example.condominiumfaultreportingsystem.security.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupService implements IGroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    private final ApplicationEventPublisher eventPublisher;

    @Value("${admin.group.name}")
    private String adminGroupName;

    public GroupTestDTO getGroupById(Long groupId){
        Group group = groupRepository.findById(groupId)
                .orElseThrow(GroupNotFoundException::new);

        return GroupTestDTO.builder()
                .groupId(groupId)
                .groupName(group.getGroupName())
                .user(group.getUsers().getFirst())
                .build();

    }

    @Transactional
    public void addAdminToGroup(Long userId) {

        Group group = groupRepository.findWithUsersByGroupName(adminGroupName)
                .orElseThrow(GroupNotFoundException::new);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (group.getUsers().contains(user)) {
            return;
        }

        group.getUsers().add(user);
        user.getGroups().add(group);

        groupRepository.save(group);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public GroupDTO addUserToGroup(Integer buildingNumber, String buildingAddress, User userToAdd){

        String uniqueKey = createGroupIdentifier(buildingNumber,buildingAddress);

        Optional<Group> existingGroupOpt = groupRepository.findWithUsersByGroupName(uniqueKey);


        if (existingGroupOpt.isPresent()){

            Group existingGroup = existingGroupOpt.get();

            if (existingGroup.getUsers().contains(userToAdd)) {
                return mapToDto(existingGroup);
            }

            existingGroup.getUsers().add(userToAdd);
            userToAdd.getGroups().add(existingGroup);

            groupRepository.save(existingGroup);

            return mapToDto(existingGroup);

        }

        Group newGroup = createGroup(uniqueKey);

        newGroup.getUsers().add(userToAdd);
        userToAdd.getGroups().add(newGroup);

        try{

            groupRepository.save(newGroup);
            return mapToDto(newGroup);

        }catch (DataIntegrityViolationException ex){

            Group group = groupRepository.findWithUsersByGroupName(uniqueKey)
                    .orElseThrow(() -> new IllegalStateException("Group should exist after conflict"));
            if (!group.getUsers().contains(userToAdd)) {
                group.getUsers().add(userToAdd);
                userToAdd.getGroups().add(group);
                groupRepository.save(group);
            }

            return mapToDto(group);

        }

    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void removeUserFromGroup(Apartment apartment, User userToRemove, Integer buildingNumber, String buildingAddress) {

        String groupName = createGroupIdentifier(buildingNumber, buildingAddress);
        Optional<Group> usersGroupOpt = groupRepository.findByGroupName(groupName);

        if (usersGroupOpt.isEmpty()){
            return;
        }

        Group usersGroup = usersGroupOpt.get();
        usersGroup.getUsers().remove(userToRemove);
        userToRemove.getGroups().remove(usersGroup);

        groupRepository.save(usersGroup);

        eventPublisher.publishEvent(
                new UserLeftEvent(apartment, userToRemove, usersGroup)
        );
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void removeUserFromAllGroups(Long userId, Company companyToRemove){

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new UserNotFoundException(userId));

        Optional<List<Group>> userGroupsOpt = groupRepository.findGroupsByUsersId(userId);

        if (userGroupsOpt.isEmpty()){
            return;
        }

        List<Group> userGroups = userGroupsOpt.get();

        for (Group group : userGroups) {
            group.getUsers().remove(user);
            user.getGroups().remove(group);
        }

        groupRepository.saveAll(userGroups);

        eventPublisher.publishEvent(
                new CompanyRemovedEvent(companyToRemove,userId,userGroups)
        );

    }

    private Group createGroup(String uniqueKey){
        return Group.builder()
                .groupName(uniqueKey)
                .users(new ArrayList<>())
                .build();
    }

    private String createGroupIdentifier(Integer buildingNumber, String buildingAddress){

        String sanitized = buildingAddress.trim()
                .replaceAll("\\s+", "_")
                .replaceAll("[^a-zA-Z0-9_-]", "");

        return sanitized + "_" + buildingNumber;
    }

    private GroupDTO mapToDto(Group group){
        return GroupDTO.builder()
                .groupId(group.getId())
                .groupName(group.getGroupName())
                .build();
    }


}
