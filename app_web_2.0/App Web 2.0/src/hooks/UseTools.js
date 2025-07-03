// src/hooks/useTools.js
import { useState, useEffect } from 'react';
import { toolsApi } from '../services/toolsApi';

export const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Función para transformar datos del backend al formato del frontend
  const transformToolData = (backendTool) => {
    return {
      _id: backendTool._id,
      uniqueId: backendTool.uniqueId || backendTool.barcode,
      specificName: backendTool.specificName || backendTool.name,
      category: backendTool.category,
      generalName: backendTool.generalName || backendTool.model,
      status: backendTool.status,
      maintenance_status: backendTool.maintenance_status || backendTool.maintenanceStatus,
      last_maintenance: backendTool.last_maintenance || backendTool.lastMaintenance,
      next_maintenance: backendTool.next_maintenance || backendTool.nextMaintenance,
      usage_count: backendTool.usage_count || backendTool.usageCount || 0,
      createdAt: backendTool.createdAt,
      updatedAt: backendTool.updatedAt
    };
  };

  // Función para transformar datos del frontend al formato del backend
  const transformToBackendFormat = (frontendTool) => {
    return {
      uniqueId: frontendTool.uniqueId,
      specificName: frontendTool.specificName,
      category: frontendTool.category,
      generalName: frontendTool.generalName,
      status: frontendTool.status,
      maintenance_status: frontendTool.maintenance_status,
      last_maintenance: frontendTool.last_maintenance,
      next_maintenance: frontendTool.next_maintenance,
      usage_count: frontendTool.usage_count || 0
    };
  };

  // Verificar conexión con el backend
  const checkConnection = async () => {
    try {
      const connected = await toolsApi.checkConnection();
      setIsConnected(connected);
      return connected;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  };

  // Cargar todas las herramientas
  const loadTools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const connected = await checkConnection();
      if (!connected) {
        throw new Error('No se pudo conectar con el servidor');
      }

      const backendTools = await toolsApi.getAllTools();
      const transformedTools = backendTools.map(transformToolData);
      setTools(transformedTools);
    } catch (error) {
      console.error('Error al cargar herramientas:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva herramienta
  const createTool = async (toolData) => {
    try {
      setError(null);
      const backendData = transformToBackendFormat(toolData);
      const newTool = await toolsApi.createTool(backendData);
      const transformedTool = transformToolData(newTool);
      setTools(prev => [...prev, transformedTool]);
      return transformedTool;
    } catch (error) {
      console.error('Error al crear herramienta:', error);
      setError(error.message);
      throw error;
    }
  };

  // Actualizar herramienta
  const updateTool = async (toolId, toolData) => {
    try {
      setError(null);
      const backendData = transformToBackendFormat(toolData);
      const updatedTool = await toolsApi.updateTool(toolId, backendData);
      const transformedTool = transformToolData(updatedTool);
      setTools(prev => prev.map(tool => 
        tool._id === toolId ? transformedTool : tool
      ));
      return transformedTool;
    } catch (error) {
      console.error('Error al actualizar herramienta:', error);
      setError(error.message);
      throw error;
    }
  };

  // Eliminar herramienta
  const deleteTool = async (toolId) => {
    try {
      setError(null);
      await toolsApi.deleteTool(toolId);
      setTools(prev => prev.filter(tool => tool._id !== toolId));
      return true;
    } catch (error) {
      console.error('Error al eliminar herramienta:', error);
      setError(error.message);
      throw error;
    }
  };

  // Obtener herramienta por ID
  const getToolById = async (toolId) => {
    try {
      setError(null);
      const tool = await toolsApi.getToolById(toolId);
      return transformToolData(tool);
    } catch (error) {
      console.error('Error al obtener herramienta:', error);
      setError(error.message);
      throw error;
    }
  };

  // Efecto para cargar herramientas al montar el componente
  useEffect(() => {
    loadTools();
  }, []);

  return {
    tools,
    loading,
    error,
    isConnected,
    loadTools,
    createTool,
    updateTool,
    deleteTool,
    getToolById,
    checkConnection
  };
};
