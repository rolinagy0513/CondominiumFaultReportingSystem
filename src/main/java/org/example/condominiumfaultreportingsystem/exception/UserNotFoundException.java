package org.example.condominiumfaultreportingsystem.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String email) {
        super("The user is not found with the email of : " + email);
    }

    public UserNotFoundException(Long userId) {
        super("The user is not found with the id of : " + userId);
    }

}
