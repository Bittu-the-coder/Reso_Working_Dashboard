import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Plus, Settings2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "react-hot-toast";
import { useTeamStore } from "../../store/useTeamStore";
import CreateTeamModal from "../../components/teams/CreateTeamModal";
import { GlowingCard, TextGenerateEffect } from "../../components/ui/aceternity";

import type { CreateTeamData, Team } from "../../types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState<boolean>(false);

  const { teams, loading, getMyTeams, createTeam } = useTeamStore();

  useEffect(() => {
    getMyTeams();
  }, [getMyTeams]);

  const handleCreateTeam = async (formData: CreateTeamData) => {
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


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? "border-blue-400" : "border-blue-600"}`} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <Users size={24} />
            </div>
            <TextGenerateEffect 
              words="Team Management" 
              className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`} 
            />
          </div>
          <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Collaborate with your research partners and manage group access.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          Create Team
        </motion.button>
      </div>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {teams.map((team: Team) => (
            <motion.div key={team._id} variants={itemVariants}>
              <GlowingCard
                className={`h-full cursor-pointer group transition-all ${
                  isDarkMode
                    ? "!bg-slate-900 !border-slate-800"
                    : "!bg-white !border-slate-200"
                }`}
                onClick={() => handleTeamClick(team._id)}
              >
                <div className="flex items-start gap-4 mb-6 relative z-10">
                  <div className="flex-shrink-0">
                    {team.avatar ? (
                      <img
                        src={team.avatar}
                        alt={team.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                        <Users className={`w-8 h-8 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {team.name}
                    </h3>
                    <p className={`text-sm mt-1 line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {team.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Active Members
                    </span>
                    <span className={`text-xs font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      {team.members.length}
                    </span>
                  </div>

                  <div className="flex -space-x-2 overflow-hidden">
                    {team.members.slice(0, 5).map((member) => (
                      <div
                        key={member._id}
                        className={`inline-block h-8 w-8 rounded-full ring-2 ${isDarkMode ? "ring-slate-900 bg-slate-800" : "ring-white bg-slate-100"} flex items-center justify-center text-[10px] font-bold overflow-hidden`}
                        title={`${member.name} (${member.role})`}
                      >
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    ))}
                    {team.members.length > 5 && (
                      <div className={`inline-block h-8 w-8 rounded-full ring-2 ${isDarkMode ? "ring-slate-900 bg-slate-800" : "ring-white bg-slate-100"} flex items-center justify-center text-[10px] font-bold text-slate-500`}>
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeamClick(team._id);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                        isDarkMode
                          ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Settings2 size={16} />
                      Manage
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle invite logic if needed
                        toast.success("Invite feature coming soon!");
                      }}
                      className={`p-2 rounded-xl border transition-all ${
                        isDarkMode
                          ? "border-slate-700 text-slate-400 hover:bg-slate-800"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                      title="Invite Member"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </GlowingCard>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDarkMode ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-slate-50"}`}>
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-slate-800 text-slate-500" : "bg-white text-slate-300"}`}>
            <Users size={32} />
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>No Teams Yet</h3>
          <p className={`mt-2 max-w-xs mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Create your first team to start collaborating on projects and research.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold mx-auto"
          >
            <Plus size={20} />
            Create Your First Team
          </button>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          isCreating={isCreatingTeam}
        />
      )}
    </div>
  );
};

export default TeamsPage;
