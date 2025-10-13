package org.example.condominiumfaultreportingsystem.group;

import org.example.condominiumfaultreportingsystem.DTO.GroupDTO;

public interface IGroupService {

    void addAdminToGroup(Long userId);
    GroupDTO addUserToGroup(Integer buildingNumber, String buildingAddress, Long userId);

}
