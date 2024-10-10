import { AxiosResByData } from '@customTypes/common';
import { userApiInstance } from '@libs/axios/axios';
import { CreateTaskRequestDto } from '@services/swagger/output/data-contracts';
import { AxiosResponse } from 'axios';

/**
 * 업무를 생성하는 API
 * @param newTask: {
 *  title: string;
 *  description?: string;
 *  startDate?: string;
 *  endDate?: string;
 *  status: number;
 *  parentTaskId?: number;
 *  projectId: number;
 *  images?: File[];
 * }
 * @returns {
 *  result: boolean;
 *  message: string;
 * }
 *
 */

interface CreateTaskParams extends CreateTaskRequestDto {
  status: number;
}

export const createTask = async (newTask: CreateTaskParams) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();

    const {
      title,
      description,
      startDate,
      endDate,
      parentTaskId,
      projectId,
      images,
    } = newTask;

    // CreateTaskRequestDto의 필드를 FormData에 추가
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    if (startDate && typeof startDate === 'string') {
      formData.append('startDate', startDate);
    }
    if (endDate && typeof endDate === 'string') {
      formData.append('endDate', endDate);
    }

    formData.append('status', newTask.status.toString());

    formData.append('projectId', projectId.toString());

    if (parentTaskId && parentTaskId !== undefined) {
      formData.append('parentTaskId', parentTaskId.toString());
    }

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    // API 요청
    const createTaskResponse: AxiosResponse<AxiosResByData<any>> =
      await userApiInstance.post('/user/api/task/v1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    console.log('업무가 성공적으로 생성되었습니다:', createTaskResponse.data);

    return createTaskResponse.data;
  } catch (error) {
    console.error('업무 생성 중 오류 발생:', error);
    throw error; // 오류 발생 시 호출자에게 예외를 던집니다.
  }
};
