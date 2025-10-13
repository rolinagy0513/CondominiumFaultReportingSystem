package org.example.condominiumfaultreportingsystem.group;

import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;
import org.example.condominiumfaultreportingsystem.company.Company;

public interface IGroupService {

    void addAdminToGroup(Long userId);
    GroupDTO addUserToGroup(Integer buildingNumber, String buildingAddress, Long userId);
    void removeUserFromGroup(Long userId, Company companyToRemove);

}
