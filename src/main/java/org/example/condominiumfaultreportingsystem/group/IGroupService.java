package org.example.condominiumfaultreportingsystem.group;

import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.company.Company;
import org.example.condominiumfaultreportingsystem.security.user.User;

public interface IGroupService {

    void addAdminToGroup(Long userId);
    GroupDTO addUserToGroup(Integer buildingNumber, String buildingAddress, User userToAdd, Apartment usersApartment);
    void removeUserFromGroup(Apartment apartment, User userToRemove, Integer buildingNumber, String buildingAddress);
    void removeUserFromAllGroups(Long userId, Company companyToRemove);


}
