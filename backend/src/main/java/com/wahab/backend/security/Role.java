package com.wahab.backend.security;

import com.google.common.collect.Sets;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
public enum Role {
    DEVELOPER(
            Sets.newHashSet(
                    Permission.DEVELOPER_READ,
                    Permission.DEVELOPER_WRITE,
                    Permission.DEVELOPER_EDIT
            )
    ),

    MANAGER(
            Sets.newHashSet(
                    Permission.MANAGER_READ,
                    Permission.MANAGER_WRITE,
                    Permission.MANAGER_EDIT
                    ,
                    Permission.DEVELOPER_READ,
                    Permission.DEVELOPER_WRITE,
                    Permission.DEVELOPER_EDIT
            )
    ),

    ADMIN(
            Sets.newHashSet(
                    Permission.ADMIN_READ,
                    Permission.ADMIN_WRITE,
                    Permission.ADMIN_EDIT,
                    Permission.ADMIN_DELETE,

                    Permission.MANAGER_READ,
                    Permission.MANAGER_WRITE,
                    Permission.MANAGER_EDIT,

                    Permission.DEVELOPER_READ,
                    Permission.DEVELOPER_WRITE,
                    Permission.DEVELOPER_EDIT
            )
    ),

    GOD(
            Sets.newHashSet()
    );

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<SimpleGrantedAuthority> grantedAuthorities() {
        Set<SimpleGrantedAuthority> permissions = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toSet());
        permissions.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return permissions;
    }
}