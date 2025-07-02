import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mail,
  Shield,
  Crown,
  User,
  Trash,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Users,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import MemberDetailModal from "../../components/teams/MemberDetailModal";
import MemberEditModal from "../../components/teams/MemberEditModal";
import { useTeamStore } from "../../store/useTeamStore";
import { useAuthStore } from "../../store/useAuthStore";
import EditTeam from "../../components/teams/EditTeam";
import type { TeamMember } from "../../types";

const TeamManagementPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [showMemberDetail, setShowMemberDetail] = useState<TeamMember | null>(
    null
  );
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    currentTeam,
    loading,
    getMyTeams,
    getTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  } = useTeamStore();
  const { user, getMe } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          await getMe();
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [user, getMe]);

  useEffect(() => {
    const fetchData = async () => {
      if (teamId) {
        try {
          await getTeam(teamId);
        } catch (error) {
          console.error("Error fetching team:", error);
        }
      } else {
        await getMyTeams();
      }
    };

    fetchData();
  }, [teamId, getTeam, getMyTeams]);

  const handleBack = () => {
    navigate("/dashboard/teams");
  };

  const handleDeleteTeam = async () => {
    if (!currentTeam) return;
    try {
      await deleteTeam(currentTeam._id);
      navigate("/dashboard/teams");
      toast.success("Team deleted successfully");
    } catch (error) {
      console.error("Failed to delete team:", error);
      toast.error("Failed to delete team");
    }
  };

  const handleChangeRole = async (
    memberId: string,
    newRole: "admin" | "member"
  ) => {
    if (!currentTeam) return;
    try {
      await updateTeamMember(currentTeam._id, memberId, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!currentTeam) return;
    // console.log("Removing member:", memberId);
    try {
      await removeTeamMember(currentTeam._id, memberId);
      toast.success("Member removed from team");
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam) return;
    if (!name || !email || !department) {
      toast.error("Please provide name, email, and department");
      return;
    }
    try {
      await addTeamMember(currentTeam._id, {
        name,
        email,
        role,
        department,
      });
      setName("");
      setEmail("");
      setDepartment("");
      setRole("member");
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error((error as Error).message || "Failed to add member");
    }
  };

  const handleUpdateMember = async (
    memberId: string,
    updatedData: {
      name?: string;
      email?: string;
      department?: string;
      role: "admin" | "member";
    }
  ) => {
    if (!currentTeam) return;
    try {
      await updateTeamMember(currentTeam._id, memberId, updatedData);
      toast.success("Member information updated");
    } catch (error) {
      console.error("Failed to update member:", error);
      toast.error("Failed to update member information");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDarkMode ? "border-blue-400" : "border-blue-600"
          }`}
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  if (!currentTeam && teamId) {
    return (
      <div
        className={`p-6 rounded-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } shadow-lg text-center`}
      >
        <Users
          className={`w-12 h-12 mx-auto mb-4 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        />
        <h2 className="text-xl font-semibold mb-2">Team Not Found</h2>
        <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          The team you're looking for doesn't exist or you don't have access to
          it.
        </p>
        <button
          onClick={handleBack}
          className={`px-6 py-2 rounded-lg ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition-colors`}
        >
          Back to Teams
        </button>
      </div>
    );
  }

  const isOwner = currentTeam?.ownerId._id === user?._id;
  const isAdmin =
    currentTeam?.members.some(
      (member) =>
        member.userId.toString() === user?._id.toString() &&
        member.role === "admin"
    ) || isOwner;

  // console.log("is owner, is Admin ", isOwner, isAdmin);
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {currentTeam?.name || "Teams"}
          </h1>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Details */}
        <div
          className={`lg:col-span-2 p-6 rounded-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Team Members ({currentTeam?.members.length || 0})
              </h2>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {currentTeam?.description && `• ${currentTeam.description}`}
              </span>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowEditModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Pencil className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Team</span>
              </button>
            )}
          </div>
          <div className="space-y-4">
            {currentTeam?.members.map((member) => (
              <div
                key={member._id}
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-750" : "bg-gray-50"
                } flex items-center justify-between group`}
              >
                <div
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => setShowMemberDetail(member)}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } flex items-center justify-center`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {member.name}
                      </p>
                      <div className="ml-2">
                        {getRoleIcon(
                          currentTeam?.ownerId?._id.toString() ===
                            member.userId.toString()
                            ? "owner"
                            : member.role
                        )}
                      </div>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          currentTeam?.ownerId?._id.toString() ===
                          member._id.toString()
                            ? isDarkMode
                              ? "bg-yellow-900/30 text-yellow-300"
                              : "bg-yellow-100 text-yellow-800"
                            : member.role === "admin"
                            ? isDarkMode
                              ? "bg-blue-900/30 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {currentTeam?.ownerId?._id.toString() ===
                        member._id.toString()
                          ? "Owner"
                          : member.role === "admin"
                          ? "Admin"
                          : "Member"}
                      </span>
                      {/* accept status pending */}
                      {member.isAcceptedInvite === false ? (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            isDarkMode
                              ? "bg-yellow-900/30 text-yellow-300"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          Pending
                        </span>
                      ) : (
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            isDarkMode
                              ? "bg-green-900/30 text-green-300"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          Verified
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {member.email} • {member.department || "No Department"}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    {member.userId.toString() !==
                      currentTeam?.ownerId?._id.toString() && (
                      <>
                        <button
                          onClick={() => setMemberToEdit(member)}
                          className={`p-1.5 rounded ${
                            isDarkMode
                              ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
                              : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                          }`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleChangeRole(
                              member._id,
                              e.target.value as "admin" | "member"
                            )
                          }
                          className={`text-sm rounded px-2 py-1 ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-300 border-gray-600"
                              : "bg-white text-gray-700 border-gray-300"
                          } border`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </>
                    )}
                    {(isOwner || (isAdmin && member.role === "member")) &&
                      member.userId.toString() !==
                        currentTeam?.ownerId?._id.toString() && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className={`p-1.5 rounded ${
                            isDarkMode
                              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Delete Team (owners only) */}
          {isOwner && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  } flex items-center space-x-2`}
                >
                  <Trash className="w-4 h-4" />
                  <span>Delete Team</span>
                </button>
              ) : (
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-red-900/30" : "bg-red-50"
                  } mt-4`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-red-400" : "text-red-600"
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Confirm Delete
                    </p>
                  </div>
                  <p
                    className={`text-sm mb-4 ${
                      isDarkMode ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    This action cannot be undone. All data associated with this
                    team will be permanently deleted.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className={`flex-1 px-3 py-1.5 rounded ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteTeam}
                      className="flex-1 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Invite Form (for admins and owners) */}
        {isAdmin && (
          <div
            className={`p-6 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg h-fit`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } flex items-center gap-2`}
            >
              <Mail className="w-5 h-5" />
              Invite Members
            </h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-lg px-3 py-3 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300 text-gray-900"
                    } border pl-9`}
                    placeholder="Name"
                    required
                  />
                  <User
                    className={`absolute top-3 left-3 w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full rounded-lg px-3 py-3 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300 text-gray-900"
                    } border pl-9`}
                    placeholder="Department"
                    required
                  />
                  <Users
                    className={`absolute top-3 left-3 w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg px-3 py-3 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300 text-gray-900"
                    } border pl-9`}
                    placeholder="Email Address"
                    required
                  />
                  <Mail
                    className={`absolute top-3 left-3 w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>

                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "admin" | "member")
                    }
                    className={`w-full rounded-lg px-3 py-3 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300 text-gray-900"
                    } border pl-9 appearance-none`}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Shield
                    className={`absolute top-3 left-3 w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium transition-colors`}
              >
                <Plus className="w-4 h-4" />
                Send Invitation
              </button>
            </form>
          </div>
        )}
      </div>
      {showMemberDetail && (
        <MemberDetailModal
          member={showMemberDetail}
          onClose={() => setShowMemberDetail(null)}
        />
      )}
      {memberToEdit && (
        <MemberEditModal
          member={memberToEdit}
          onClose={() => setMemberToEdit(null)}
          onUpdate={(updatedData) =>
            handleUpdateMember(memberToEdit._id, {
              ...updatedData,
              role: updatedData.role || "member",
            })
          }
          isDarkMode={isDarkMode}
        />
      )}
      {/* Edit Team Modal */}
      {showEditModal && (
        <EditTeam
          onClose={() => setShowEditModal(false)}
          isDarkMode={isDarkMode}
          teamData={currentTeam}
        />
      )}
    </div>
  );
};

export default TeamManagementPage;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Mail,
//   Shield,
//   Crown,
//   User,
//   Trash,
//   Plus,
//   ArrowLeft,
//   AlertTriangle,
//   Users,
//   Pencil,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "react-hot-toast";
// import { useTheme } from "../../contexts/ThemeContext";
// import MemberDetailModal from "../../components/teams/MemberDetailModal";
// import MemberEditModal from "../../components/teams/MemberEditModal";
// import { useTeamStore } from "../../store/useTeamStore";
// import { useAuthStore } from "../../store/useAuthStore";
// import EditTeam from "../../components/teams/EditTeam";

// const TeamManagementPage: React.FC = () => {
//   const { teamId } = useParams<{ teamId: string }>();
//   const navigate = useNavigate();
//   const { isDarkMode } = useTheme();
//   const [showMemberDetail, setShowMemberDetail] = useState(null);
//   const [memberToEdit, setMemberToEdit] = useState(null);
//   const [name, setName] = useState("");
//   const [department, setDepartment] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState<"admin" | "member">("member");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const {
//     currentTeam,
//     loading,
//     error,
//     getMyTeams,
//     getTeam,
//     createTeam,
//     updateTeam,
//     deleteTeam,
//     addTeamMember,
//     removeTeamMember,
//     updateTeamMember,
//   } = useTeamStore();
//   const { user, getMe, loading: authLoading } = useAuthStore();

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!user) {
//         try {
//           await getMe();
//         } catch (error) {
//           console.error("Error fetching user:", error);
//         }
//       }
//     };

//     fetchUser();
//   }, [user, getMe]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (teamId) {
//         try {
//           const response = await getTeam(teamId); // Add await
//         } catch (error) {
//           console.error("Error fetching team:", error);
//         }
//       } else {
//         await getMyTeams(); // Also await if getMyTeams is async
//       }
//     };

//     fetchData();
//   }, [teamId, getTeam, getMyTeams]);

//   const handleBack = () => {
//     navigate("/dashboard/teams");
//   };

//   const handleDeleteTeam = async () => {
//     if (!currentTeam) return;
//     try {
//       await deleteTeam(currentTeam._id);
//       navigate("/dashboard/teams");
//       toast.success("Team deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete team:", error);
//       toast.error("Failed to delete team");
//     }
//   };

//   const handleChangeRole = async (
//     memberId: string,
//     newRole: "admin" | "member"
//   ) => {
//     if (!currentTeam) return;
//     try {
//       await updateTeamMember(currentTeam._id, memberId, { role: newRole });
//       toast.success(`Role updated to ${newRole}`);
//     } catch (error) {
//       console.error("Failed to update role:", error);
//       toast.error("Failed to update role");
//     }
//   };

//   const handleRemoveMember = async (memberId: string) => {
//     if (!currentTeam) return;
//     console.log("Removing member:", memberId);
//     try {
//       await removeTeamMember(currentTeam._id, memberId);
//       toast.success("Member removed from team");
//     } catch (error) {
//       console.error("Failed to remove member:", error);
//       toast.error("Failed to remove member");
//     }
//   };

//   const handleAddMember = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentTeam) return;
//     // Validate required fields
//     if (!name || !email || !department) {
//       toast.error("Please provide name, email, and department");
//       return;
//     }
//     try {
//       await addTeamMember(currentTeam._id, {
//         name,
//         email,
//         role,
//         department,
//       });
//       // Reset form
//       setName("");
//       setEmail("");
//       setDepartment("");
//       setRole("member");
//       toast.success("Member added successfully");
//     } catch (error) {
//       console.error("Failed to add member:", error);
//       toast.error(error.message || "Failed to add member");
//     }
//   };

//   const handleUpdateMember = async (
//     memberId: string,
//     updatedData: {
//       name?: string;
//       email?: string;
//       department?: string;
//       role?: "admin" | "member";
//     }
//   ) => {
//     if (!currentTeam) return;
//     try {
//       await updateTeamMember(currentTeam._id, memberId, updatedData);
//       toast.success("Member information updated");
//     } catch (error) {
//       console.error("Failed to update member:", error);
//       toast.error("Failed to update member information");
//     }
//   };

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case "owner":
//         return <Crown className="w-4 h-4 text-yellow-500" />;
//       case "admin":
//         return <Shield className="w-4 h-4 text-blue-500" />;
//       default:
//         return <User className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div
//           className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
//             isDarkMode ? "border-blue-400" : "border-blue-600"
//           }`}
//           aria-label="Loading"
//         ></div>
//       </div>
//     );
//   }

//   if (!currentTeam && teamId) {
//     return (
//       <div
//         className={`p-6 rounded-xl ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-white"
//         } shadow-lg text-center`}
//       >
//         <Users
//           className={`w-12 h-12 mx-auto mb-4 ${
//             isDarkMode ? "text-gray-400" : "text-gray-500"
//           }`}
//         />
//         <h2 className="text-xl font-semibold mb-2">Team Not Found</h2>
//         <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
//           The team you're looking for doesn't exist or you don't have access to
//           it.
//         </p>
//         <button
//           onClick={handleBack}
//           className={`px-6 py-2 rounded-lg ${
//             isDarkMode
//               ? "bg-blue-600 hover:bg-blue-700"
//               : "bg-blue-600 hover:bg-blue-700"
//           } text-white transition-colors`}
//         >
//           Back to Teams
//         </button>
//       </div>
//     );
//   }

//   const isOwner = currentTeam?.ownerId._id === user._id;
//   const isAdmin =
//     currentTeam?.members.some(
//       (member) =>
//         member.userId.toString() === user._id.toString() &&
//         member.role === "admin"
//     ) || isOwner;

//   console.log("is owner, is Admin ", isOwner, isAdmin);
//   return (
//     <div className="space-y-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex justify-between items-center"
//       >
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleBack}
//             className={`p-2 rounded-lg ${
//               isDarkMode
//                 ? "hover:bg-gray-700 text-gray-300"
//                 : "hover:bg-gray-100 text-gray-600"
//             }`}
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1
//             className={`text-2xl font-bold ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             {currentTeam?.name || "Teams"}
//           </h1>
//         </div>
//       </motion.div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Team Details */}
//         <div
//           className={`lg:col-span-2 p-6 rounded-xl ${
//             isDarkMode ? "bg-gray-800" : "bg-white"
//           } shadow-lg`}
//         >
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <h2
//                 className={`text-xl font-semibold ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 Team Members ({currentTeam?.members.length || 0})
//               </h2>
//               <span
//                 className={`text-sm ${
//                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                 }`}
//               >
//                 {currentTeam?.description && `• ${currentTeam.description}`}
//               </span>
//             </div>

//             {isAdmin && (
//               <button
//                 onClick={() => setShowEditModal(true)}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
//                   isDarkMode
//                     ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
//                     : "bg-gray-100 hover:bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 <Pencil className="w-4 h-4" />
//                 <span className="text-sm font-medium">Edit Team</span>
//               </button>
//             )}
//           </div>
//           <div className="space-y-4">
//             {currentTeam?.members.map((member) => (
//               <div
//                 key={member._id}
//                 className={`p-4 rounded-lg ${
//                   isDarkMode ? "bg-gray-750" : "bg-gray-50"
//                 } flex items-center justify-between group`}
//               >
//                 <div
//                   className="flex items-center space-x-3 flex-1 cursor-pointer"
//                   onClick={() => setShowMemberDetail(member)}
//                 >
//                   <div
//                     className={`w-10 h-10 rounded-full ${
//                       isDarkMode ? "bg-gray-700" : "bg-gray-200"
//                     } flex items-center justify-center`}
//                   >
//                     <span
//                       className={`text-sm font-medium ${
//                         isDarkMode ? "text-gray-300" : "text-gray-700"
//                       }`}
//                     >
//                       {member.name.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   <div>
//                     <div className="flex items-center">
//                       <p
//                         className={`font-medium ${
//                           isDarkMode ? "text-white" : "text-gray-900"
//                         }`}
//                       >
//                         {member.name}
//                       </p>
//                       <div className="ml-2">
//                         {getRoleIcon(
//                           currentTeam?.ownerId?._id.toString() ===
//                             member.userId.toString()
//                             ? "owner"
//                             : member.role
//                         )}
//                       </div>
//                       <span
//                         className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
//                           currentTeam?.ownerId?._id.toString() ===
//                           member._id.toString()
//                             ? isDarkMode
//                               ? "bg-yellow-900/30 text-yellow-300"
//                               : "bg-yellow-100 text-yellow-800"
//                             : member.role === "admin"
//                             ? isDarkMode
//                               ? "bg-blue-900/30 text-blue-300"
//                               : "bg-blue-100 text-blue-800"
//                             : isDarkMode
//                             ? "bg-gray-700 text-gray-300"
//                             : "bg-gray-200 text-gray-700"
//                         }`}
//                       >
//                         {currentTeam?.ownerId?._id.toString() ===
//                         member._id.toString()
//                           ? "Owner"
//                           : member.role === "admin"
//                           ? "Admin"
//                           : "Member"}
//                       </span>
//                     </div>
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-400" : "text-gray-600"
//                       }`}
//                     >
//                       {member.email} • {member.department || "No Department"}
//                     </p>
//                   </div>
//                 </div>
//                 {isAdmin && (
//                   <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
//                     {member.userId.toString() !==
//                       currentTeam?.ownerId?._id.toString() && (
//                       <>
//                         <button
//                           onClick={() => setMemberToEdit(member)}
//                           className={`p-1.5 rounded ${
//                             isDarkMode
//                               ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
//                               : "bg-gray-200 text-blue-600 hover:bg-gray-300"
//                           }`}
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <select
//                           value={member.role}
//                           onChange={(e) =>
//                             handleChangeRole(
//                               member._id,
//                               e.target.value as "admin" | "member"
//                             )
//                           }
//                           className={`text-sm rounded px-2 py-1 ${
//                             isDarkMode
//                               ? "bg-gray-700 text-gray-300 border-gray-600"
//                               : "bg-white text-gray-700 border-gray-300"
//                           } border`}
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <option value="member">Member</option>
//                           <option value="admin">Admin</option>
//                         </select>
//                       </>
//                     )}
//                     {(isOwner || (isAdmin && member.role === "member")) &&
//                       member.userId.toString() !==
//                         currentTeam?.ownerId?._id.toString() && (
//                         <button
//                           onClick={() => handleRemoveMember(member._id)}
//                           className={`p-1.5 rounded ${
//                             isDarkMode
//                               ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
//                               : "bg-red-50 text-red-600 hover:bg-red-100"
//                           }`}
//                         >
//                           <Trash className="w-4 h-4" />
//                         </button>
//                       )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           {/* Delete Team (owners only) */}
//           {isOwner && (
//             <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//               {!showDeleteConfirm ? (
//                 <button
//                   onClick={() => setShowDeleteConfirm(true)}
//                   className={`px-4 py-2 rounded-lg ${
//                     isDarkMode
//                       ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
//                       : "bg-red-50 text-red-600 hover:bg-red-100"
//                   } flex items-center space-x-2`}
//                 >
//                   <Trash className="w-4 h-4" />
//                   <span>Delete Team</span>
//                 </button>
//               ) : (
//                 <div
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? "bg-red-900/30" : "bg-red-50"
//                   } mt-4`}
//                 >
//                   <div className="flex items-center space-x-2 mb-3">
//                     <AlertTriangle
//                       className={`w-5 h-5 ${
//                         isDarkMode ? "text-red-400" : "text-red-600"
//                       }`}
//                     />
//                     <p
//                       className={`font-medium ${
//                         isDarkMode ? "text-red-400" : "text-red-600"
//                       }`}
//                     >
//                       Confirm Delete
//                     </p>
//                   </div>
//                   <p
//                     className={`text-sm mb-4 ${
//                       isDarkMode ? "text-red-300" : "text-red-700"
//                     }`}
//                   >
//                     This action cannot be undone. All data associated with this
//                     team will be permanently deleted.
//                   </p>
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setShowDeleteConfirm(false)}
//                       className={`flex-1 px-3 py-1.5 rounded ${
//                         isDarkMode
//                           ? "bg-gray-700 text-gray-300"
//                           : "bg-gray-200 text-gray-700"
//                       }`}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleDeleteTeam}
//                       className="flex-1 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
//                     >
//                       Yes, Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//         {/* Invite Form (for admins and owners) */}
//         {isAdmin && (
//           <div
//             className={`p-6 rounded-xl ${
//               isDarkMode ? "bg-gray-800" : "bg-white"
//             } shadow-lg h-fit`}
//           >
//             <h2
//               className={`text-xl font-semibold mb-4 ${
//                 isDarkMode ? "text-white" : "text-gray-900"
//               } flex items-center gap-2`}
//             >
//               <Mail className="w-5 h-5" />
//               Invite Members
//             </h2>
//             <form onSubmit={handleAddMember} className="space-y-4">
//               <div className="space-y-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className={`w-full rounded-lg px-3 py-3 ${
//                       isDarkMode
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "border-gray-300 text-gray-900"
//                     } border pl-9`}
//                     placeholder="Name"
//                     required
//                   />
//                   <User
//                     className={`absolute top-3 left-3 w-4 h-4 ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   />
//                 </div>

//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                     className={`w-full rounded-lg px-3 py-3 ${
//                       isDarkMode
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "border-gray-300 text-gray-900"
//                     } border pl-9`}
//                     placeholder="Department"
//                     required
//                   />
//                   <Users
//                     className={`absolute top-3 left-3 w-4 h-4 ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   />
//                 </div>

//                 <div className="relative">
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className={`w-full rounded-lg px-3 py-3 ${
//                       isDarkMode
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "border-gray-300 text-gray-900"
//                     } border pl-9`}
//                     placeholder="Email Address"
//                     required
//                   />
//                   <Mail
//                     className={`absolute top-3 left-3 w-4 h-4 ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   />
//                 </div>

//                 <div className="relative">
//                   <select
//                     value={role}
//                     onChange={(e) =>
//                       setRole(e.target.value as "admin" | "member")
//                     }
//                     className={`w-full rounded-lg px-3 py-3 ${
//                       isDarkMode
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "border-gray-300 text-gray-900"
//                     } border pl-9 appearance-none`}
//                   >
//                     <option value="member">Member</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                   <Shield
//                     className={`absolute top-3 left-3 w-4 h-4 ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
//                   isDarkMode
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } text-white font-medium transition-colors`}
//               >
//                 <Plus className="w-4 h-4" />
//                 Send Invitation
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//       {showMemberDetail && (
//         <MemberDetailModal
//           member={showMemberDetail}
//           onClose={() => setShowMemberDetail(null)}
//         />
//       )}
//       {memberToEdit && (
//         <MemberEditModal
//           member={memberToEdit}
//           onClose={() => setMemberToEdit(null)}
//           onUpdate={(updatedData) =>
//             handleUpdateMember(memberToEdit._id, updatedData)
//           }
//           isDarkMode={isDarkMode}
//         />
//       )}
//       {/* Edit Team Modal */}
//       {showEditModal && (
//         <EditTeam
//           onClose={() => setShowEditModal(false)}
//           isDarkMode={isDarkMode}
//           teamData={currentTeam}
//         />
//       )}
//     </div>
//   );
// };

// export default TeamManagementPage;
