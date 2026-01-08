package org.example.condominiumfaultreportingsystem.eventHandler.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.condominiumfaultreportingsystem.apartment.Apartment;
import org.example.condominiumfaultreportingsystem.group.Group;
import org.example.condominiumfaultreportingsystem.security.user.User;

@Getter
@AllArgsConstructor
public class UserJoinedEvent {

    private Apartment apartment;
    private User user;
    private Group group;

}
