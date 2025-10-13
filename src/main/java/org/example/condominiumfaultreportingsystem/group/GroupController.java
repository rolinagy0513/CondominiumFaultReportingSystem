package org.example.condominiumfaultreportingsystem.group;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.group.impl.GroupService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GroupController {

    private final GroupService groupService;

}
