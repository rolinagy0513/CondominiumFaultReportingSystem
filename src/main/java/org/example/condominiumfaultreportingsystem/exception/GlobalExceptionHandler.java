package org.example.condominiumfaultreportingsystem.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ConcurrentModificationException;

/**
 * GlobalExceptionHandler.java
 * - Centralized exception handler for REST controllers.
 * - Handles various custom and database exceptions, returning
 * - meaningful HTTP responses with error details and appropriate status codes.
 * - Provides consistent error response structure for the API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Internal record to standardize API error responses.
     */
    private record ApiError(String message, String details, LocalDateTime timestamp){}

    /**
     * Handles UserNotFoundException.
     * Returns HTTP 404 with error details when a user resource is not found (can be used with the users email(String) or the id(Long)).
     *
     * @param ex the UserNotFoundException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiError> handleUserNotFoundException(UserNotFoundException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(), "User resource was not found", LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles InvalidPasswordException.
     * Returns HTTP 400 when an invalid password is provided.
     *
     * @param ex the InvalidPasswordException thrown
     * @return ResponseEntity with ApiError and HTTP 400 status
     */
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ApiError> handleInvalidPasswordException(InvalidPasswordException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(), "Invalid Password", LocalDateTime.now()),
                HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Handles BuildingIsPresentException.
     * Returns HTTP 409 when a building is already present in the system.
     *
     * @param ex the BuildingIsPresentException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(BuildingIsPresentException.class)
    public ResponseEntity<ApiError> handleBuildingIsPresentException(BuildingIsPresentException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(), "The building with the provided data is already present in the system", LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles BuildingIsNotPresentException.
     * Returns HTTP 404 when a building is not present in the system (Can take Long, Integer and String values).
     *
     * @param ex the BuildingIsNotPresentException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(BuildingIsNotFoundException.class)
    public ResponseEntity<ApiError> handleBuildingIsNotFoundException(BuildingIsNotFoundException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(), "The building with the provided data is not present in the system", LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles ApartmentNotFoundException.
     * Returns HTTP 404 when a building is not present in the system (Can take Long, Integer and String values).
     *
     * @param ex the ApartmentNotFoundException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(ApartmentNotFoundException.class)
    public ResponseEntity<ApiError> handleApartmentNotFoundException(ApartmentNotFoundException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The apartment with the provided id is not found in the system associated with the provided building id",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles InvalidRoleException.
     * Returns HTTP 403 when a user does not have the right role.
     *
     * @param ex the InvalidRoleException thrown
     * @return ResponseEntity with ApiError and HTTP 403 status
     */
    @ExceptionHandler(InvalidRoleException.class)
    public ResponseEntity<ApiError> handleInvalidRoleException(InvalidRoleException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The user doesn't has the right role",
                        LocalDateTime.now()),
                HttpStatus.FORBIDDEN
        );
    }

    /**
     * Handles GroupNotFoundException.
     * Returns HTTP 404 when a searched group has not been found.
     *
     * @param ex the GroupNotFoundException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(GroupNotFoundException.class)
    public ResponseEntity<ApiError> handleGroupNotFoundException(GroupNotFoundException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The searched group has not been found",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles InvalidRequestException.
     * Returns HTTP 409 when an admin tries to accept a request that is not in PENDING status.
     *
     * @param ex the InvalidRequestException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiError> handleInvalidRequestException(InvalidRequestException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "Can not edit a request that is not in PENDING status",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles RequestNotFoundException.
     * Returns HTTP 404 when a request is not found with the provided id can be used with ApartmentRequestStatus and CompanyRequestStatus.
     *
     * @param ex the RequestNotFoundException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(RequestNotFoundException.class)
    public ResponseEntity<ApiError> handleInvalidRequestException(RequestNotFoundException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The request was not found",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles UserAlreadyHasCompanyException.
     * Returns HTTP 409 when a user tries to register a company whilst already having one.
     *
     * @param ex the UserAlreadyHasCompanyException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(UserAlreadyHasCompanyException.class)
    public ResponseEntity<ApiError> handleUserAlreadyHasCompanyException(UserAlreadyHasCompanyException ex){
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "One user can only have one company registered",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles MultipleModificationException.
     * Returns HTTP 409 when a concurrent modification is detected, typically due to race conditions.
     *
     * @param ex the MultipleModificationException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(MultipleModificationException.class)
    public ResponseEntity<ApiError> handleMultipleModificationException(MultipleModificationException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The resource was modified by another process. Please try again.",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles ExistingPendingRequestException.
     * Returns HTTP 409 when a user already has a PENDING request.
     *
     * @param ex the ExistingPendingRequestException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(ExistingPendingRequestException.class)
    public ResponseEntity<ApiError> handleExistingPendingRequestException(ExistingPendingRequestException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The user can not have multiple PENDING requests",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles RoleValidationException.
     * Returns HTTP 409 if the role change validation fails.
     *
     * @param ex the RoleValidationException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(RoleValidationException.class)
    public ResponseEntity<ApiError> handleRoleValidationException(RoleValidationException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The role change validation rules were not respected",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles RequestStatusNotValidException.
     * Returns HTTP 409 if the request's status is not ACCEPTED or REJECTED.
     *
     * @param ex the RequestStatusNotValidException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(RequestStatusNotValidException.class)
    public ResponseEntity<ApiError> handleRequestStatusNotValidException(RequestStatusNotValidException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The request needs to have a status of ACCEPTED or REJECTED",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles CompanyNotFoundException.
     * Returns HTTP 404 if the company has not been found with the provided data can be used with id and serviceType and with both.
     *
     * @param ex the CompanyNotFoundException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(CompanyNotFoundException.class)
    public ResponseEntity<ApiError> handleCompanyNotFoundException(CompanyNotFoundException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The company resource was not found",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles CompanyNotFoundInBuildingException.
     * Returns HTTP 404 if the company has not been found in the building with the provided id.
     *
     * @param ex the CompanyNotFoundInBuildingException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(CompanyNotFoundInBuildingException.class)
    public ResponseEntity<ApiError> handleCompanyNotFoundInBuildingException(CompanyNotFoundInBuildingException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The company resource was not found",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles ApartmentNotFoundInBuildingException.
     * Returns HTTP 404 if the apartments are not found inside the building with the provided id
     * (can be used with the id only and together with the floorNumber).
     *
     * @param ex the ApartmentNotFoundInBuildingException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(ApartmentNotFoundInBuildingException.class)
    public ResponseEntity<ApiError> handleApartmentNotFoundInBuildingException(ApartmentNotFoundInBuildingException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The apartment was not found in the building",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles ApartmentRequestAlreadyPendingException.
     * Returns HTTP 409 if the requested apartment has a PENDING,OCCUPIED or UNAVAILABLE status.
     *
     * @param ex the ApartmentRequestAlreadyPendingException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(ApartmentRequestAlreadyPendingException.class)
    public ResponseEntity<ApiError> handleApartmentRequestIsAlreadyPendingException(ApartmentRequestAlreadyPendingException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The apartment is either unavailable, in progress or is already occupied",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles InvalidInputsException.
     * Returns HTTP 400 when the provided inputs are null.
     *
     * @param ex the InvalidInputsException thrown
     * @return ResponseEntity with ApiError and HTTP 400 status
     */
    @ExceptionHandler(InvalidInputsException.class)
    public ResponseEntity<ApiError> handleInvalidInputsException(InvalidInputsException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The provided inputs can not be null",
                        LocalDateTime.now()),
                HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Handles FloorCanNotBeNullException.
     * Returns HTTP 400 when the provided inputs are null.
     *
     * @param ex the FloorCanNotBeNullException thrown
     * @return ResponseEntity with ApiError and HTTP 400 status
     */
    @ExceptionHandler(FloorCanNotBeNullException.class)
    public ResponseEntity<ApiError> handleFloorCanNotBeNullException(FloorCanNotBeNullException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The floor van not be 0",
                        LocalDateTime.now()),
                HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Handles UserAlreadyHasRequestException.
     * Returns HTTP 409 when the user has an ongoing pending request.
     *
     * @param ex the UserAlreadyHasRequestException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(UserAlreadyHasRequestException.class)
    public ResponseEntity<ApiError> handleUserAlreadyHasRequestException(UserAlreadyHasRequestException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The user already submitted a pending request that needs to be sorted first",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles InvalidRequestStatusException.
     * Returns HTTP 409 when somehow the method returns a not PENDING apartmentRequest even taught it is prevented
     *
     * @param ex the InvalidRequestStatusException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(InvalidRequestStatusException.class)
    public ResponseEntity<ApiError> handleUserAlreadyHasRequestException(InvalidRequestStatusException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The method returned requests that are not PENDING",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles ApartmentIsUnavailableException.
     * Returns HTTP 409 when the apartment where the admin wanted to add a resident manually is unavailable
     *
     * @param ex the ApartmentIsUnavailableException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(ApartmentIsUnavailableException.class)
    public ResponseEntity<ApiError> handleApartmentIsUnavailableException(ApartmentIsUnavailableException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The apartment either has a PENDING or UNAVAILABLE or OCCUPIED status",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles UserAssignedToMultipleGroupsException.
     * Returns HTTP 409 when the resident is assigned to multiple groups instead of one
     *
     * @param ex the UserAssignedToMultipleGroupsException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(UserAssignedToMultipleGroupsException.class)
    public ResponseEntity<ApiError> handleUserAssignedToMultipleGroupsException(UserAssignedToMultipleGroupsException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The resident can only be in one group",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles ReportNotFoundException.
     * Returns HTTP 404 when the resident is assigned to multiple groups instead of one
     *
     * @param ex the ReportNotFoundException thrown
     * @return ResponseEntity with ApiError and HTTP 404 status
     */
    @ExceptionHandler(ReportNotFoundException.class)
    public ResponseEntity<ApiError> handleReportNotFoundException(ReportNotFoundException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "No public and submitted report has been found",
                        LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles UnauthorizedApartmentAccessException.
     * Returns HTTP 409 when a user tries to send a message to a group where he doesn't belong to
     *
     * @param ex the UnauthorizedApartmentAccessException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(UnauthorizedApartmentAccessException.class)
    public ResponseEntity<ApiError> handleUnauthorizedApartmentAccessExceptionException(UnauthorizedApartmentAccessException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The user doesn't have access to this group",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles ReportServiceTypeMismatchException.
     * Returns HTTP 409 when a report and the service type is not matching
     *
     * @param ex the ReportServiceTypeMismatchException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(ReportServiceTypeMismatchException.class)
    public ResponseEntity<ApiError> handleReportServiceTypeMismatchException(ReportServiceTypeMismatchException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "There was a mismatch between the company's services and the reports type",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles InvalidReportStatusException.
     * Returns HTTP 409 when a report doesn't have the required status
     *
     * @param ex the InvalidReportStatusException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(InvalidReportStatusException.class)
    public ResponseEntity<ApiError> handleInvalidReportStatusException(InvalidReportStatusException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The report is not in the right state",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles UserNotPartOfCompanyException.
     * Returns HTTP 409 when a user is not owning the company with the provided id.
     *
     * @param ex the UserNotPartOfCompanyException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(UserNotPartOfCompanyException.class)
    public ResponseEntity<ApiError> handleInvalidReportStatusException(UserNotPartOfCompanyException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The currently authenticated user is not owning the company with the provided id",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles ReportAlreadyAcceptedException.
     * Returns HTTP 409 when a report has been accepted by another company.
     *
     * @param ex the ReportAlreadyAcceptedException thrown
     * @return ResponseEntity with ApiError and HTTP 409 status
     */
    @ExceptionHandler(ReportAlreadyAcceptedException.class)
    public ResponseEntity<ApiError> handleReportAlreadyAcceptedException(ReportAlreadyAcceptedException ex) {
        return new ResponseEntity<>(
                new ApiError(ex.getMessage(),
                        "The report has already been accepted by another company",
                        LocalDateTime.now()),
                HttpStatus.CONFLICT
        );
    }

    /**
     * Handles DataAccessException from Spring Data.
     * Returns HTTP 500 for database operation failures with details.
     *
     * @param ex the DataAccessException thrown
     * @return ResponseEntity with ApiError and HTTP 500 status
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiError> handleDataAccessException(DataAccessException ex) {
        return new ResponseEntity<>(
                new ApiError("Database operation failed", ex.getMostSpecificCause().getMessage(), LocalDateTime.now()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}
