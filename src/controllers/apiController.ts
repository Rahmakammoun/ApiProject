import { Request, Response as ExpressResponse } from 'express';
import Api from '../models/api';
import ResponseModel from '../models/response';

interface Params {
  [key: string]: string;
}


const parameterMapping: { [key: string]: string } = {
  catégorie: 'category',
  idproduct: 'id',
  produitid: 'id',
  
};


const normalizeAndMapParams = (params: Params) => {
  const normalized: Params = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const normalizedKey = key.toLowerCase();
      const mappedKey = parameterMapping[normalizedKey] || normalizedKey;
      normalized[mappedKey] = params[key];
    }
  }
  return normalized;
};

export const executeAdminApi = async (req: Request, res: ExpressResponse) => {
  const { name, params } = req.body;

  try {
  
    const api = await Api.findOne({ where: { name } });

    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Normaliser et mapper les paramètres
    const normalizedParams = JSON.stringify(normalizeAndMapParams(params));

   
    const response = await ResponseModel.findOne({ where: { apiId: api.id, params: normalizedParams } });

    if (!response) {
      return res.status(404).json({ message: 'Response not found for this API' });
    }

    // Retourner la réponse de l'API
    return res.status(200).json({
      apiResponse: JSON.parse(response.data)
    });
  } catch (err) {
    console.error('Error executing API:', err);
    return res.status(500).json({ message: 'Internal server error', error: (err as Error).message });
  }
};
