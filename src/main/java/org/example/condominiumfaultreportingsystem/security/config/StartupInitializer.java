package org.example.condominiumfaultreportingsystem.security.config;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.group.GroupRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StartupInitializer implements CommandLineRunner {

    private final GroupRepository groupRepository;

    @Value("${admin.group.name}")
    private String adminGroupName;

    @Override
    public void run(String... args) {
        Optional<Group> group = groupRepository.findByGroupName("Admins");

        if (group.isEmpty()){
            Group newGroup = Group.builder()
                    .groupName(adminGroupName)
                    .build();

            groupRepository.save(newGroup);
        }
    }

}
