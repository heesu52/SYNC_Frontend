import { EditProjectParams } from '@customTypes/project';
import { useLoggedInUserStore } from '@libs/store';
import { CreateProjectRequestDto } from '@services/swagger/output/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProject,
  deleteProject,
  editProject,
  getProject,
  getProjectIdList,
  getProjectList,
} from './apis';

// projectList hooks
export const useGetProjectList = () => {
  const { loggedInUser } = useLoggedInUserStore();
  const { data: projectListData } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjectList,
  });

  return { projectListData };
};

// ProjectList id list hooks
export const useGetProjectIdList = () => {
  const { data: projectIdsList } = useQuery({
    queryKey: ['projectIds'],
    queryFn: getProjectIdList,
  });

  return { projectIdsList };
};

// project hooks
export const useGetProject = (projectId: number) => {
  const { data: projectData } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProject(projectId),
  });

  return { projectData };
};

// create project hooks
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: (newProject: CreateProjectRequestDto) =>
      createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  return { createProjectMutate: createProjectMutation.mutate };
};

// edit project hooks
export const useEditProject = () => {
  const queryClient = useQueryClient();

  const editProjectMutation = useMutation({
    mutationFn: (project: EditProjectParams) => editProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { editProjectMutate: editProjectMutation.mutate };
};

// delete project hooks
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { deleteProjectMutate: deleteProjectMutation.mutate };
};
