package com.wahab.backend.security;

import lombok.Getter;

@Getter
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_WRITE("admin:write"),
    ADMIN_EDIT("admin:edit"),
    ADMIN_DELETE("admin:delete"),

    MANAGER_READ("manager:read"),
    MANAGER_WRITE("manager:write"),
    MANAGER_EDIT("manager:edit"),
    MANAGER_DELETE("manager:delete"),

    DEVELOPER_READ("developer:read"),
    DEVELOPER_WRITE("developer:write"),
    DEVELOPER_EDIT("developer:edit"),
    DEVELOPER_DELETE("developer:delete");

    private final String permission;

    Permission(String permission){
        this.permission = permission;
    }
}