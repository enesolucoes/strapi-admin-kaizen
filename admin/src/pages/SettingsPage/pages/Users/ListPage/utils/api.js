import { axiosInstance } from '../../../../../../core/utils';

const fetchData = async (search, notify) => {
  const {
    data: { data },
  } = await axiosInstance.get(`/admin/users${search}`);

  notify();

  return data;
};

const deleteData = async ids => {
  await axiosInstance.post('/admin/users/batch-delete', { ids });
};

const fetchDataPermission = async () => {
  const { data } = await axiosInstance.get('/content-manager/collection-types/api::permissao.permissao?page=1&pageSize=10000&sort=Nome:ASC');
  return data?.results;
};

const fetchDataUsersPermission = async () => {
  const { data }  = await axiosInstance.get('/content-manager/collection-types/api::usuario-permissao.usuario-permissao?page=1&pageSize=100000&sort=id:ASC');
  return data.results;
};

export { deleteData, fetchData, fetchDataPermission, fetchDataUsersPermission };
