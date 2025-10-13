package org.example.condominiumfaultreportingsystem.security.user;

import lombok.RequiredArgsConstructor;
import org.example.condominiumfaultreportingsystem.DTO.UserDTO;
import org.example.condominiumfaultreportingsystem.DTO.UserWithRoleDTO;
import org.example.condominiumfaultreportingsystem.exception.InvalidRoleException;
import org.example.condominiumfaultreportingsystem.exception.RoleValidationException;
import org.example.condominiumfaultreportingsystem.exception.UserNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.function.LongFunction;
import java.util.stream.Collectors;

/**
 * Service class responsible fo r user-related business logic such as
 * retrieving the current authenticated user, fetching other users,
 * and handling password changes.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    /**
     * Retrieves the currently authenticated user's basic information.
     *
     * @return a UserDTO containing the authenticated user's ID and full name
     * @throws UserNotFoundException if no user matches the authenticated email
     */
    public UserDTO getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =  userRepository.findByEmail(email)
                .orElseThrow(()->new UserNotFoundException(email));

        return UserDTO.builder()
                .id(user.getId())
                .userName(user.getFirstname() + " " + user.getLastname())
                .build();
    }

    /**
     * Retrieves the currently authenticated user's basic information.
     * This method is used explicitly in the place where I check before an admin only method that this is truly the admin
     *
     * @return a AdminDTO containing the authenticated user's ID name and role
     * @throws UserNotFoundException if no user matches the authenticated email
     */
    public UserWithRoleDTO getCurrentUserWithRole() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return UserWithRoleDTO.builder()
                .id(user.getId())
                .userName(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Retrieves all users from the database.
     *
     * @return list of UserDTOs for all users
     */
    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .userName(user.getFirstname() + " " + user.getLastname())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Retrieves the User entity corresponding to the given security Principal.
     *
     * @param principal the authenticated user's Principal
     * @return the User entity matching the principal's email
     * @throws UserNotFoundException if no user matches the principal's email or if principal is null
     */
    public User getUserFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new UserNotFoundException("No authenticated user");
        }
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException(principal.getName()));
    }

    /**
     * Retrieves a list of all users excluding the one with the specified ID.
     *
     * @param excludedUserId the ID of the user to exclude
     * @return list of UserDTOs for all other users
     */
    public List<UserDTO> getAuthenticatedUsers(Long excludedUserId) {
        List<User> users = userRepository.findAllByIdNot(excludedUserId);

        return users.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .userName(user.getFirstname() + " " + user.getLastname())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Changes the password of the authenticated user after validating the current password
     * and confirming that the new password matches the confirmation.
     *
     * @param request the password change request containing current, new, and confirmation passwords
     * @param connectedUser the authenticated user's Principal
     * @throws IllegalStateException if the current password is incorrect or the new passwords do not match
     */
    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void promoteUserToCompany(Long currentUserId, Long userToUpdateId) {
        changeUserRole(currentUserId, userToUpdateId, Role.COMPANY, Role.ADMIN);
    }

    private void changeUserRole(Long currentUserId, Long userToUpdateId, Role newRole, Role requiredRole){

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(()-> new UserNotFoundException(currentUserId));

        if (currentUser.getRole() != requiredRole){
            throw new InvalidRoleException();
        }

        User userToUpdate = userRepository.findById(userToUpdateId)
                .orElseThrow(()-> new UserNotFoundException(userToUpdateId));

        if (userToUpdate.getId().equals(currentUser.getId())){
            throw new RoleValidationException("Can not change your role");
        }

        validateRoles(userToUpdate.getRole(), newRole);

        userToUpdate.setRole(newRole);
        userRepository.save(userToUpdate);

    }

    private void validateRoles(Role currentRole, Role newRole){

        if (newRole == Role.ADMIN) {
            throw new RoleValidationException("Admin role can only be assigned manually");
        }

        if (currentRole == Role.ADMIN) {
            throw new RoleValidationException("Cannot demote admin users");
        }

        if (currentRole == Role.COMPANY && newRole == Role.USER) {
            throw new RoleValidationException("Company users cannot revert to regular users");
        }

        if (currentRole == Role.COMPANY && newRole == Role.COMPANY){
            throw new RoleValidationException("You are already present in the system as a company");
        }

    }
}
