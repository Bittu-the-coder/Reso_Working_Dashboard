import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Plus, Mail, Crown, Shield, User } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "react-hot-toast";
import { useTeamStore } from "../../store/useTeamStore";
import CreateTeamModal from "../../components/teams/CreateTeamModal";

import type { Team, TeamMember } from "../../types";

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(false);

  const { teams, loading, error, getMyTeams, createTeam } = useTeamStore();

  useEffect(() => {
    getMyTeams();
  }, [getMyTeams]);

  const handleCreateTeam = async (formData: FormData) => {
    setIsCreatingTeam(true);
    try {
      await createTeam(formData);
      setShowCreateModal(false);
      toast.success("Team created successfully");
    } catch (error) {
      console.error("Failed to create team:", error);
      toast.error("Failed to create team");
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const handleTeamClick = (teamId: string) => {
    navigate(`/dashboard/teams/${teamId}`);
  };

  const getRoleIcon = (role: string): React.ReactNode => {
    switch (role.toLowerCase()) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" aria-hidden="true" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" aria-hidden="true" />;
      default:
        return <User className="w-4 h-4 text-gray-500" aria-hidden="true" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users
            className={`w-6 h-6 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
            aria-hidden="true"
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
          aria-label="Create new team"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <section aria-labelledby="teams-list-heading">
        <h2 id="teams-list-heading" className="sr-only">
          Your Teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: Team) => (
            <motion.div
              key={team._id}
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-200 hover:shadow-lg"
              } border rounded-lg p-6 transition-all cursor-pointer`}
              onClick={() => handleTeamClick(team._id)}
              whileHover={{ scale: 1.02 }}
              role="button"
              tabIndex={0}
              aria-label={`Team ${team.name}`}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleTeamClick(team._id);
                }
              }}
            >
              <div className="flex items-start space-x-4 mb-5">
                <div className="flex-shrink-0 self-center justify-center">
                  {team.avatar ? (
                    <img
                      src={team.avatar}
                      alt={`${team.name} logo`}
                      className="w-14 h-14 rounded-lg object-cover border-2 border-opacity-20 shadow-sm"
                      style={{
                        borderColor: isDarkMode ? "#3b82f6" : "#2563eb",
                      }}
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                        isDarkMode ? "bg-gray-700" : "bg-blue-100"
                      }`}
                    >
                      <Users
                        className={`w-7 h-7 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3
                      className={`text-lg font-bold truncate ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {team.name}
                    </h3>
                  </div>
                  {team.description && (
                    <p
                      className={`text-sm mt-1 line-clamp-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {team.description}
                    </p>
                  )}
                </div>
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
                  {team.members.slice(0, 3).map((member: TeamMember) => (
                    <div
                      key={member._id}
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
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {member.name}
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
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleTeamClick(team._id);
                  }}
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } py-2 rounded-lg flex items-center justify-center space-x-2 text-sm`}
                  aria-label={`Manage team ${team.name}`}
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Manage Team</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {teams.length === 0 && !loading && (
        <div
          className={`text-center p-10 rounded-lg border ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <Users
            className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
            aria-hidden="true"
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No Teams Yet
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Create your first team to collaborate with others
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`${
              isDarkMode
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded-lg inline-flex items-center gap-2`}
            aria-label="Create your first team"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create Team
          </button>
        </div>
      )}
      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          isDarkMode={isDarkMode}
          isCreating={isCreatingTeam}
        />
      )}
    </div>
  );
};

export default TeamsPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Users, Plus, Mail, Crown, Shield, User, Pencil } from "lucide-react";
// import { useTheme } from "../../contexts/ThemeContext";
// import { toast } from "react-hot-toast";
// import { useTeamStore } from "../../store/useTeamStore";
// import CreateTeamModal from "../../components/teams/CreateTeamModal";

// const TeamsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { isDarkMode } = useTheme();
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [isCreatingTeam, setIsCreatingTeam] = useState(false);

//   const { teams, loading, error, getMyTeams, createTeam } = useTeamStore();

//   useEffect(() => {
//     getMyTeams();
//   }, [getMyTeams]);

//   const handleCreateTeam = async (formData: FormData) => {
//     setIsCreatingTeam(true);
//     try {
//       // Create team with FormData
//       await createTeam(formData);
//       setShowCreateModal(false);
//       toast.success("Team created successfully");
//     } catch (error) {
//       console.error("Failed to create team:", error);
//       toast.error("Failed to create team");
//     } finally {
//       setIsCreatingTeam(false);
//     }
//   };

//   const handleTeamClick = (teamId: string) => {
//     navigate(`/dashboard/teams/${teamId}`);
//   };

//   const getRoleIcon = (role: string) => {
//     switch (role.toLowerCase()) {
//       case "owner":
//         return <Crown className="w-4 h-4 text-yellow-500" aria-hidden="true" />;
//       case "admin":
//         return <Shield className="w-4 h-4 text-blue-500" aria-hidden="true" />;
//       default:
//         return <User className="w-4 h-4 text-gray-500" aria-hidden="true" />;
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

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <Users
//             className={`w-6 h-6 ${
//               isDarkMode ? "text-blue-400" : "text-blue-600"
//             }`}
//             aria-hidden="true"
//           />
//           <h1
//             className={`text-2xl font-bold ${
//               isDarkMode ? "text-gray-200" : "text-gray-900"
//             }`}
//           >
//             Teams
//           </h1>
//         </div>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className={`${
//             isDarkMode
//               ? "bg-blue-700 hover:bg-blue-800"
//               : "bg-blue-600 hover:bg-blue-700"
//           } text-white px-4 py-2 rounded-lg flex items-center space-x-2`}
//           aria-label="Create new team"
//         >
//           <Plus className="w-4 h-4" aria-hidden="true" />
//           <span>Create Team</span>
//         </button>
//       </div>
//       {/* Teams Grid */}
//       <section aria-labelledby="teams-list-heading">
//         <h2 id="teams-list-heading" className="sr-only">
//           Your Teams
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {teams.map((team) => (
//             <motion.div
//               key={team._id}
//               className={`${
//                 isDarkMode
//                   ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
//                   : "bg-white border-gray-200 hover:shadow-lg"
//               } border rounded-lg p-6 transition-all cursor-pointer`}
//               onClick={() => handleTeamClick(team._id)}
//               whileHover={{ scale: 1.02 }}
//               role="button"
//               tabIndex={0}
//               aria-label={`Team ${team.name}`}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === " ") {
//                   handleTeamClick(team._id);
//                 }
//               }}
//             >
//               <div className="flex items-start space-x-4 mb-5">
//                 <div className="flex-shrink-0 self-center justify-center">
//                   {team.avatar ? (
//                     <img
//                       src={team.avatar}
//                       alt={`${team.name} logo`}
//                       className="w-14 h-14 rounded-lg object-cover border-2 border-opacity-20 shadow-sm"
//                       style={{
//                         borderColor: isDarkMode ? "#3b82f6" : "#2563eb",
//                       }}
//                     />
//                   ) : (
//                     <div
//                       className={`w-14 h-14 rounded-lg flex items-center justify-center ${
//                         isDarkMode ? "bg-gray-700" : "bg-blue-100"
//                       }`}
//                     >
//                       <Users
//                         className={`w-7 h-7 ${
//                           isDarkMode ? "text-blue-400" : "text-blue-600"
//                         }`}
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-center">
//                     <h3
//                       className={`text-lg font-bold truncate ${
//                         isDarkMode ? "text-gray-100" : "text-gray-800"
//                       }`}
//                     >
//                       {team.name}
//                     </h3>
//                   </div>
//                   {team.description && (
//                     <p
//                       className={`text-sm mt-1 line-clamp-2 ${
//                         isDarkMode ? "text-gray-400" : "text-gray-600"
//                       }`}
//                     >
//                       {team.description}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                   <span
//                     className={`${
//                       isDarkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     Members
//                   </span>
//                   <span
//                     className={`font-medium ${isDarkMode ? "text-white" : ""}`}
//                   >
//                     {team.members.length}
//                   </span>
//                 </div>
//                 <div className="space-y-2">
//                   {team.members.slice(0, 3).map((member) => (
//                     <div
//                       key={member._id}
//                       className="flex items-center space-x-2"
//                     >
//                       <div
//                         className={`w-6 h-6 ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-300"
//                         } rounded-full flex items-center justify-center`}
//                       >
//                         <span
//                           className={`text-xs font-medium ${
//                             isDarkMode ? "text-gray-300" : "text-gray-700"
//                           }`}
//                         >
//                           {member.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <span
//                         className={`text-sm ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         }`}
//                       >
//                         {member.name}
//                       </span>
//                       {getRoleIcon(member.role)}
//                     </div>
//                   ))}
//                   {team.members.length > 3 && (
//                     <div
//                       className={`text-xs ${
//                         isDarkMode ? "text-gray-400" : "text-gray-500"
//                       }`}
//                     >
//                       +{team.members.length - 3} more members
//                     </div>
//                   )}
//                 </div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleTeamClick(team._id);
//                   }}
//                   className={`w-full ${
//                     isDarkMode
//                       ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   } py-2 rounded-lg flex items-center justify-center space-x-2 text-sm`}
//                   aria-label={`Manage team ${team.name}`}
//                 >
//                   <Mail className="w-4 h-4" aria-hidden="true" />
//                   <span>Manage Team</span>
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>
//       {teams.length === 0 && !loading && (
//         <div
//           className={`text-center p-10 rounded-lg border ${
//             isDarkMode
//               ? "border-gray-700 bg-gray-800"
//               : "border-gray-200 bg-gray-50"
//           }`}
//         >
//           <Users
//             className={`w-16 h-16 mx-auto mb-4 ${
//               isDarkMode ? "text-gray-600" : "text-gray-400"
//             }`}
//             aria-hidden="true"
//           />
//           <h3
//             className={`text-lg font-medium mb-2 ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             No Teams Yet
//           </h3>
//           <p
//             className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
//           >
//             Create your first team to collaborate with others
//           </p>
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className={`${
//               isDarkMode
//                 ? "bg-blue-700 hover:bg-blue-800"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white px-6 py-2 rounded-lg inline-flex items-center gap-2`}
//             aria-label="Create your first team"
//           >
//             <Plus className="w-4 h-4" aria-hidden="true" />
//             Create Team
//           </button>
//         </div>
//       )}
//       {/* Create Team Modal */}
//       {showCreateModal && (
//         <CreateTeamModal
//           onClose={() => setShowCreateModal(false)}
//           onSubmit={handleCreateTeam}
//           isDarkMode={isDarkMode}
//           isCreating={isCreatingTeam}
//         />
//       )}
//     </div>
//   );
// };

// export default TeamsPage;
