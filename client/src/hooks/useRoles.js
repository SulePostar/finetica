import { fetchRoles, addRole, selectRoles, deleteRole, selectRolesLoading } from '../redux/roles/rolesSlice.js';
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirst } from '../helpers/capitalizeFirstLetter.js';

export function useRoles() {
  const dispatch = useDispatch();

  const roles = useSelector(selectRoles) || [];
  const rolesLoading = useSelector(selectRolesLoading);


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

  const roleOptions = useMemo(() => {
    if (rolesLoading) return [{ value: 'loading', label: 'Loading...' }];
    return roles
      .filter((r) => r.id && r.role)
      .map((r) => ({ value: r.id.toString(), label: capitalizeFirst(r.role) }));
  }, [roles, rolesLoading]);

  return {
    roles,
    roleName,
    roleOptions,
    setRoleName,
    onAddRole,
    deleteRole: (id) => dispatch(deleteRole(id)),
  };
}

