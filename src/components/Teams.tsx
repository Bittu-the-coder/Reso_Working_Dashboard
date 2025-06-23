import React, { useState, useEffect } from "react";
import { Users, Plus, Settings, Mail, Crown, Shield, User } from "lucide-react";
import { teamAPI, inviteAPI, type Team, type Invite } from "../service/teams";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/useTheme";

const Teams: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [teams, setTeams] = useState<Team[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsResponse, invitesResponse] = await Promise.all([
        teamAPI.getTeams(),
        inviteAPI.getUserInvites("pending"),
      ]);

      setTeams(teamsResponse.data.data);
      setInvites(invitesResponse.data.data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load teams and invites");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await teamAPI.createTeam(data);
      setTeams([response.data.data, ...teams]);
      setShowCreateModal(false);
      toast.success("Team created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create team");
    }
  };

  const handleInviteUser = async (email: string, role: "admin" | "member") => {
    if (!selectedTeam) return;

    try {
      await teamAPI.inviteUser(selectedTeam._id, { email, role });
      setShowInviteModal(false);
      toast.success("Invitation sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const response = await inviteAPI.acceptInvite(inviteId);
      setInvites(invites.filter((invite) => invite._id !== inviteId));
      setTeams([response.data.data.team, ...teams]);
      toast.success("Invitation accepted!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to accept invitation"
      );
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await inviteAPI.rejectInvite(inviteId);
      setInvites(invites.filter((invite) => invite._id !== inviteId));
      toast.success("Invitation rejected");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to reject invitation"
      );
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
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users
            className={`w-6 h-6 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Teams
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`${
            isDarkMode
              ? "bg-blue-700 hover:bg-blue-800"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded-lg flex items-center space-x-2`}
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div
          className={`${
            isDarkMode
              ? "bg-yellow-900/30 border-yellow-800"
              : "bg-yellow-50 border-yellow-200"
          } border rounded-lg p-4`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-yellow-300" : "text-gray-900"
            } mb-3`}
          >
            Pending Invitations
          </h2>
          <div className="space-y-3">
            {invites.map((invite) => (
              <div
                key={invite._id}
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-yellow-800"
                    : "bg-white border-yellow-200"
                } border rounded-lg p-4 flex items-center justify-between`}
              >
                <div>
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {invite.teamId.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Invited by {invite.invitedBy.name} as {invite.role}
                  </p>
                  {invite.message && (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      } mt-1`}
                    >
                      "{invite.message}"
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptInvite(invite._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectInvite(invite._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team._id}
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                : "bg-white border-gray-200 hover:shadow-lg"
            } border rounded-lg p-6 transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {team.name}
                </h3>
                {team.description && (
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } mt-1`}
                  >
                    {team.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTeam(team);
                  setShowInviteModal(true);
                }}
                className={`${
                  isDarkMode
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Members
                </span>
                <span
                  className={`font-medium ${isDarkMode ? "text-white" : ""}`}
                >
                  {team.members.length}
                </span>
              </div>

              <div className="space-y-2">
                {team.members.slice(0, 3).map((member) => (
                  <div
                    key={member.userId._id}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className={`w-6 h-6 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-300"
                      } rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {member.userId.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {member.userId.name}
                    </span>
                    {getRoleIcon(member.role)}
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    +{team.members.length - 3} more members
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedTeam(team);
                  setShowInviteModal(true);
                }}
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } py-2 rounded-lg flex items-center justify-center space-x-2 text-sm`}
              >
                <Mail className="w-4 h-4" />
                <span>Invite Members</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
        />
      )}

      {/* Invite User Modal */}
      {showInviteModal && selectedTeam && (
        <InviteUserModal
          team={selectedTeam}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteUser}
        />
      )}
    </div>
  );
};

// Create Team Modal Component
const CreateTeamModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team description"
              rows={3}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Invite User Modal Component
const InviteUserModal: React.FC<{
  team: Team;
  onClose: () => void;
  onSubmit: (email: string, role: "admin" | "member") => void;
}> = ({ team, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email, role);
      setEmail("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Invite User to {team.name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "member")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Teams;
