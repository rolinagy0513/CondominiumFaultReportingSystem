package org.example.condominiumfaultreportingsystem.exception;

public class GroupNotFoundException extends RuntimeException {
    public GroupNotFoundException() {
        super("The group has not been found");
    }
}
