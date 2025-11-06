import { fetchRoles, addRole, selectRoles, deleteRole } from '../redux/roles/rolesSlice.js';
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";


export function useRoles() {
  const dispatch = useDispatch();

  const roles = useSelector(selectRoles) || [];


  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const [roleName, setRoleName] = useState('');

  const onAddRole = useCallback(() => {
    const name = roleName.trim();
    if (!name) return;
    dispatch(addRole({ role: name })).then((res) => {
      if (!res.error) {
        setRoleName('');
        dispatch(fetchRoles());
      }
    });
  }, [dispatch, roleName]);

  return {
    roles,
    roleName,
    setRoleName,
    onAddRole,
    deleteRole: (id) => dispatch(deleteRole(id)),
  };
}