package org.example.condominiumfaultreportingsystem.group;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.GroupTestDTO;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/admin/group/getGroup/{groupId}")
    public GroupTestDTO getGroup(
            @PathVariable Long groupId
    ){
        return groupService.getGroupById(groupId);
    }

}
