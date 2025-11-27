package org.example.condominiumfaultreportingsystem.exception;

public class UserAssignedToMultipleGroupsException extends RuntimeException {
    public UserAssignedToMultipleGroupsException() {
        super("Resident is assigned to multiple groups, but only one group is allowed.");
    }
}
