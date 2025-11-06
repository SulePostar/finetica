import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStatuses, addStatus, selectStatuses, deleteStatus } from '../redux/statuses/statusesSlice.js';

export function useStatuses() {
  const dispatch = useDispatch();
  const statuses = useSelector(selectStatuses) || [];

  useEffect(() => {
    dispatch(fetchStatuses());
  }, [dispatch]);

  const [statusName, setStatusName] = useState('');
  const [statusType] = useState('Pending');

  const onAddStatus = useCallback(() => {
    const name = statusName.trim();
    if (!name) return;
    dispatch(addStatus({ status: name, type: statusType })).then((res) => {
      if (!res.error) {
        setStatusName('');
        dispatch(fetchStatuses());
      }
    });
  }, [dispatch, statusName, statusType]);

  return {
    statuses,
    statusName,
    setStatusName,
    onAddStatus,
    deleteStatus: (id) => dispatch(deleteStatus(id)),
  }
}