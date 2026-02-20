import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, MoreHorizontal, Shield, User, X, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "../../../components/shared/PageHeader";
import Modal from "../../../components/shared/Modal";
import roleApi from "../../../api/admin/roleApi";
import permissionApi from "../../../api/admin/permissionApi";
import userApi from "../../../api/admin/userApi";
import "./ManagementPages.css";
import "./PermissionsPage.css";

const PermissionsPage = () => {
    // State
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [allPermissions, setAllPermissions] = useState([]);

    // Member State
    const [roleMembers, setRoleMembers] = useState([]);
    const [memberPage, setMemberPage] = useState(1);
    const [memberMeta, setMemberMeta] = useState(null);
    const [memberLoading, setMemberLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("permissions"); // "permissions" or "members"
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modals
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Fetch members when selected role changes
    useEffect(() => {
        if (selectedRole) {
            setMemberPage(1); // Reset to page 1
            fetchRoleMembers(selectedRole.id, 1);
        }
    }, [selectedRole]);

    // Fetch members when page changes
    useEffect(() => {
        if (selectedRole && activeTab === 'members') {
            fetchRoleMembers(selectedRole.id, memberPage);
        }
    }, [memberPage]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [fetchedRoles, fetchedPermissions] = await Promise.all([
                roleApi.getAllRoles(),
                permissionApi.getAllPermissions()
            ]);
            setRoles(fetchedRoles);
            setAllPermissions(fetchedPermissions);

            if (fetchedRoles.length > 0) {
                setSelectedRole(fetchedRoles[0]);
            }

            // Fetch member counts for all roles (1-4 or more)
            // We use Promise.all to fetch counts in parallel
            fetchedRoles.forEach(async (role) => {
                try {
                    const res = await userApi.getUsers({
                        "filter": `role.id:${role.id}`,
                        page: 1,
                        size: 1 // We only need meta.total
                    });
                    setRoles(prev => prev.map(r =>
                        r.id === role.id ? { ...r, memberCount: res.meta.total } : r
                    ));
                } catch (err) {
                    console.error(`Failed to fetch count for role ${role.id}`, err);
                }
            });

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoleMembers = async (roleId, page) => {
        setMemberLoading(true);
        try {
            // Updated userApi.getUsers returns { result: [], meta: {} }
            const response = await userApi.getUsers({
                "filter": `role.id:${roleId}`,
                page: page,
                size: 10
            });

            setRoleMembers(response.result || []);
            setMemberMeta(response.meta);

            // Update role count in sidebar
            setRoles(prevRoles => prevRoles.map(r =>
                r.id === roleId
                    ? { ...r, memberCount: response.meta.total }
                    : r
            ));
        } catch (error) {
            console.error("Failed to fetch role members:", error);
            setRoleMembers([]);
        } finally {
            setMemberLoading(false);
        }
    };

    // Role Color Mapping
    const getRoleStyle = (roleName) => {
        const name = roleName?.toUpperCase() || "";
        if (name.includes("ADMIN")) return { bg: "#FEF2F2", text: "#EF4444", border: "#FECACA" }; // Red
        if (name.includes("DRIVER")) return { bg: "#EFF6FF", text: "#3B82F6", border: "#BFDBFE" }; // Blue
        if (name.includes("RESTAURANT") || name.includes("PARTNER")) return { bg: "#FFF7ED", text: "#F97316", border: "#FED7AA" }; // Orange
        if (name.includes("CUSTOMER") || name.includes("USER")) return { bg: "#ECFDF5", text: "#10B981", border: "#A7F3D0" }; // Green
        return { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" }; // Gray default
    };

    // Group permissions by resource (e.g., "users.read" -> Group "Users")
    const getPermissionGroups = () => {
        const groups = {};
        allPermissions.forEach(perm => {
            // Assuming permission name format "resource.action" (e.g. "users.read")
            // or just use the name if not dot-separated
            const parts = perm.name.split('.');
            const resource = parts[0] || "Other";
            const groupName = resource.charAt(0).toUpperCase() + resource.slice(1) + " Management";

            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(perm);
        });
        return groups;
    };

    const handlePermissionToggle = async (permissionId) => {
        if (!selectedRole) return;

        // Clone current permissions
        const currentPermissions = selectedRole.permissions || [];
        const exists = currentPermissions.some(p => p.id === permissionId);

        let newPermissions;
        if (exists) {
            newPermissions = currentPermissions.filter(p => p.id !== permissionId);
        } else {
            const permissionToAdd = allPermissions.find(p => p.id === permissionId);
            newPermissions = [...currentPermissions, permissionToAdd];
        }

        // Optimistic update
        const updatedRole = { ...selectedRole, permissions: newPermissions };
        setSelectedRole(updatedRole);

        // Update in list
        setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));

        try {
            // API Call to update role
            await roleApi.updateRole(updatedRole);
        } catch (error) {
            console.error("Failed to update permissions:", error);
            // Revert on error
            fetchInitialData();
        }
    };

    const handleDeleteMember = async (userId) => {
        if (!confirm("Are you sure you want to remove this member from the role?")) return;
        try {
            // To remove a member, we might need to set their role to null or a default role.
            // This depends on backend logic. Assuming updating user with null role works.
            // Or update with a default 'User' role if 'null' is not allowed.
            const user = await userApi.getUserById(userId);
            await userApi.updateUser({ ...user, role: null }); // or default role
            fetchRoleMembers(selectedRole.id, memberPage);
        } catch (error) {
            console.error("Failed to remove member:", error);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newRole = {
            name: formData.get("name"),
            description: formData.get("description"),
            permissions: []
        };

        try {
            const created = await roleApi.createRole(newRole);
            setRoles([...roles, created]);
            setCreateModalOpen(false);
            setSelectedRole(created);
        } catch (error) {
            console.error("Failed to create role:", error);
        }
    };

    const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const permissionGroups = getPermissionGroups();

    // Render
    const roleStyle = selectedRole ? getRoleStyle(selectedRole.name) : {};

    return (
        <div className="management-page permissions-page">
            <PageHeader
                title="ACCESS CONTROL"
                subtitle="Manage staff roles, permissions, and administrative access levels."
                badge="SECURITY CONSOLE"
                badgeColor="green"
                BadgeIcon={Shield}
            />

            <div className="roles-layout">
                {/* Left Sidebar: Roles List */}
                <div className="roles-sidebar">
                    <div className="roles-search">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn-add-role" onClick={() => setCreateModalOpen(true)}>
                            <Plus size={16} /> Create Role
                        </button>
                    </div>

                    <div className="roles-list">
                        <div className="roles-list-header">
                            <span>ROLES • {roles.length}</span>
                            <span>MEMBERS</span>
                        </div>
                        {loading ? (
                            // Skeleton for Roles List
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="role-item" style={{ pointerEvents: 'none' }}>
                                    <div className="role-item-main">
                                        <div className="role-icon-wrapper" style={{ background: '#e5e7eb', color: 'transparent' }}>
                                            <div style={{ width: 16, height: 16 }}></div>
                                        </div>
                                        <div className="role-info" style={{ width: '100%' }}>
                                            <div style={{ height: 16, width: '60%', background: '#e5e7eb', borderRadius: 4, marginBottom: 4 }}></div>
                                            <div style={{ height: 12, width: '80%', background: '#e5e7eb', borderRadius: 4 }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredRoles.map(role => {
                                const style = getRoleStyle(role.name);
                                return (
                                    <div
                                        key={role.id}
                                        className={`role-item ${selectedRole?.id === role.id ? 'active' : ''}`}
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        <div className="role-item-main">
                                            <div className={`role-icon-wrapper`} style={{
                                                background: selectedRole?.id === role.id ? '#111827' : style.bg,
                                                color: selectedRole?.id === role.id ? 'white' : style.text
                                            }}>
                                                <Shield size={16} />
                                            </div>
                                            <div className="role-info">
                                                <span className="role-name">{role.name}</span>
                                                <span className="role-desc">{role.description || "No description"}</span>
                                            </div>
                                        </div>
                                        <div className="role-meta">
                                            <div className="role-members-count">
                                                <User size={12} />
                                                <span>{role.memberCount !== undefined ? role.memberCount : (role.users?.length || 0)}</span>
                                            </div>
                                            <button className="btn-role-more"><MoreHorizontal size={16} /></button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Content: Role Details */}
                <div className="roles-content">
                    {loading ? (
                        <div className="role-details-skeleton">
                            <div className="role-header">
                                <div className="role-header-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <div style={{ height: 32, width: 200, background: '#e5e7eb', borderRadius: 8 }}></div>
                                        <div style={{ height: 24, width: 60, background: '#e5e7eb', borderRadius: 12 }}></div>
                                    </div>
                                    <div style={{ height: 16, width: 300, background: '#e5e7eb', borderRadius: 4 }}></div>
                                </div>
                            </div>
                            <div className="role-body">
                                <div className="permissions-view">
                                    <div className="permissions-toolbar">
                                        <div style={{ height: 36, width: 250, background: '#e5e7eb', borderRadius: 8 }}></div>
                                    </div>
                                    <div className="permissions-grid">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="permission-group">
                                                <div style={{ height: 24, width: 150, background: '#e5e7eb', borderRadius: 4, marginBottom: 16 }}></div>
                                                <div className="permission-items">
                                                    {[...Array(4)].map((_, j) => (
                                                        <div key={j} className="permission-item" style={{ height: 60 }}>
                                                            <div className="perm-info" style={{ width: '100%' }}>
                                                                <div style={{ height: 16, width: '60%', background: '#e5e7eb', borderRadius: 4, marginBottom: 8 }}></div>
                                                                <div style={{ height: 12, width: '80%', background: '#e5e7eb', borderRadius: 4 }}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : selectedRole ? (
                        <>
                            <div className="role-header">
                                <div className="role-header-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h2 style={{ margin: 0 }}>{selectedRole.name}</h2>
                                        <span style={{
                                            fontSize: '12px',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            background: roleStyle.bg,
                                            color: roleStyle.text,
                                            border: `1px solid ${roleStyle.border}`
                                        }}>
                                            ID: {selectedRole.id}
                                        </span>
                                    </div>
                                    <p>{selectedRole.description}</p>
                                </div>
                                <div className="role-header-actions">
                                    <div className="role-tabs">
                                        <button
                                            className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('permissions')}
                                        >
                                            Permissions
                                        </button>
                                        <button
                                            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('members')}
                                        >
                                            Manage Members ({memberMeta?.total || roleMembers.length})
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="role-body">
                                {activeTab === 'permissions' ? (
                                    <div className="permissions-view">
                                        <div className="permissions-toolbar">
                                            <div className="search-input-wrapper">
                                                <Search size={16} />
                                                <input type="text" placeholder="Search permissions..." />
                                            </div>
                                            <div className="permissions-summary">
                                                <span className="status-dot"></span>
                                                <span className="current-role-badge">{selectedRole.name}</span>
                                                <span className="perm-count">{selectedRole.permissions?.length || 0} permissions</span>
                                            </div>
                                            <button className="btn-clear-perms">Clear permissions</button>
                                        </div>

                                        <div className="permissions-grid">
                                            {Object.entries(permissionGroups).map(([group, perms]) => (
                                                <div key={group} className="permission-group">
                                                    <h3>{group}</h3>
                                                    <div className="permission-items">
                                                        {perms.map(perm => (
                                                            <div key={perm.id} className="permission-item">
                                                                <div className="perm-info">
                                                                    <span className="perm-name">{perm.name}</span>
                                                                    <span className="perm-desc">{perm.description || "Allows access to " + perm.name}</span>
                                                                </div>
                                                                <label className="toggle-switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedRole.permissions?.some(p => p.id === perm.id) || false}
                                                                        onChange={() => handlePermissionToggle(perm.id)}
                                                                    />
                                                                    <span className="slider round"></span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="members-view">
                                        <div className="permissions-toolbar">
                                            <div className="search-input-wrapper">
                                                <Search size={16} />
                                                <input type="text" placeholder="Search members..." />
                                            </div>
                                            <button
                                                className="btn-add-member"
                                                onClick={() => setAddMemberModalOpen(true)}
                                            >
                                                <Plus size={16} /> Add Members
                                            </button>
                                        </div>

                                        <div className="members-list">
                                            {memberLoading ? (
                                                <div className="text-center p-4">Loading members...</div>
                                            ) : roleMembers.map(member => (
                                                <div key={member.id} className="member-item" style={{ background: 'white' }}>
                                                    <div className="member-avatar" style={{ background: roleStyle.bg, color: roleStyle.text }}>
                                                        <span>{member.name?.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="member-info">
                                                        <span className="member-name">{member.name}</span>
                                                        <span className="member-email">{member.email}</span>
                                                    </div>
                                                    <button
                                                        className="btn-remove-member"
                                                        onClick={() => handleDeleteMember(member.id)}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {!memberLoading && roleMembers.length === 0 && (
                                                <div className="empty-state">No members found with this role.</div>
                                            )}
                                        </div>

                                        {/* Pagination Controls */}
                                        {memberMeta && memberMeta.pages > 1 && (
                                            <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                                                <button
                                                    className="btn-icon"
                                                    disabled={memberPage === 1}
                                                    onClick={() => setMemberPage(p => p - 1)}
                                                    style={{
                                                        color: memberPage === 1 ? '#D1D5DB' : '#6B7280',
                                                        cursor: memberPage === 1 ? 'not-allowed' : 'pointer',
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>

                                                {/* Simple Page Numbers logic */}
                                                {Array.from({ length: memberMeta.pages }, (_, i) => i + 1).map(pageNum => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setMemberPage(pageNum)}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '8px',
                                                            fontWeight: 600,
                                                            fontSize: '14px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            background: memberPage === pageNum ? '#84cc16' : 'transparent', // lime-500
                                                            color: memberPage === pageNum ? 'white' : '#6B7280',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}

                                                <button
                                                    className="btn-icon"
                                                    disabled={memberPage >= memberMeta.pages}
                                                    onClick={() => setMemberPage(p => p + 1)}
                                                    style={{
                                                        color: memberPage >= memberMeta.pages ? '#D1D5DB' : '#6B7280',
                                                        cursor: memberPage >= memberMeta.pages ? 'not-allowed' : 'pointer',
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: '8px'
                                                    }}
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="empty-selection">Select a role to view details</div>
                    )}
                </div>
            </div>

            {/* Modals... */}
            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Role" size="md">
                <form onSubmit={handleCreateRole}>
                    <div className="form-group">
                        <label className="form-label">Role Name</label>
                        <input name="name" className="form-input" required placeholder="e.g. Sales Manager" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-textarea" placeholder="Role description..." />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setCreateModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Role</button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addMemberModalOpen} onClose={() => setAddMemberModalOpen(false)} title="Add Members to Role" size="lg">
                <div className="p-4 text-center text-gray-500">User search and selection functionality would go here.</div>
            </Modal>
        </div>
    );
};

export default PermissionsPage;
