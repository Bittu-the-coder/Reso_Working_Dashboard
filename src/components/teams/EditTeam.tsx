import { useState } from "react";
import { useTeamStore } from "../../store/useTeamStore";
import { X } from "lucide-react";

const EditTeam = ({
  teamData,
  onClose,
  isDarkMode,
}: {
  teamData: any;
  onClose: () => void;
  isDarkMode: boolean;
}) => {
  const [teamName, setTeamName] = useState(teamData?.name || "");
  const [teamDescription, setTeamDescription] = useState(
    teamData?.description || ""
  );
  const [teamDepartment, setTeamDepartment] = useState(
    teamData?.department || ""
  );

  const { updateTeam } = useTeamStore();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTeam(teamData._id, {
        name: teamName,
        description: teamDescription,
        department: teamDepartment,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
          isDarkMode ? "dark" : ""
        }`}
      >
        <div
          className={`p-6 rounded-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } max-w-md w-full mx-4`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Edit Team
          </h3>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label htmlFor="teamName" className="block text-gray-600 mb-2">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="teamDescription"
                className="block text-gray-600 mb-2"
              >
                Team Description
              </label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="teamDepartment"
                className="block text-gray-600 mb-2"
              >
                Department
              </label>
              <input
                type="text"
                id="teamDepartment"
                value={teamDepartment}
                onChange={(e) => setTeamDepartment(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className={`mr-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                Update Team
              </button>
            </div>
          </form>
        </div>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <X />
        </button>
      </div>
    </>
  );
};

export default EditTeam;
