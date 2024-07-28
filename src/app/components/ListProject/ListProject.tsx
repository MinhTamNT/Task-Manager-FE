import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { IProject } from "@/app/lib";

interface IListProject {
  listProject: IProject[];
}

const ListProject: React.FC<IListProject> = ({ listProject }) => {
  const [sortOption, setSortOption] = useState<string>("view");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = listProject.filter((project) =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <label htmlFor="search" className="text-gray-600 font-medium">
              Search:
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by project name"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="sort" className="text-gray-600 font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="view">Most Viewed</option>
              <option value="created_at">Created At</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-default">Project Name</th>
                <th className="th-default">Status</th>
                <th className="th-default">Total Members</th>
                <th className="th-default">Owner</th>
                <th className="th-default">Description</th>
                <th className="th-default"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project, index) => (
                <tr key={project.id}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="td-content">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="td-content">{project.members?.uuid}</td>
                  <td className="td-content">{project.author?.name}</td>
                  <td className="td-content">{project.description}</td>
                  <td className="td-content">
                    <Box>
                      <Tooltip title="Delete">
                        <IconButton aria-label="delete" size="medium">
                          <DeleteOutline fontSize="inherit" color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton aria-label="edit" size="medium">
                          <EditOutlined fontSize="inherit" color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProject;
