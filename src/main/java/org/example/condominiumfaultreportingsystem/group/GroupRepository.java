package org.example.condominiumfaultreportingsystem.group;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT g FROM Group g WHERE g.groupName = :groupName")
    Optional<Group> findByGroupName(@Param("groupName") String groupName);

    /**
     * Fetches the Group and the users together eagerly everything else is fetched as defined(lazy)
     * @param groupName The name of the group
     * @return The Group with the users
     */
    @EntityGraph(attributePaths = "users", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Group> findWithUsersByGroupName(String groupName);

}
