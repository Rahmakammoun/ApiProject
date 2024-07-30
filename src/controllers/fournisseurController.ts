import axios from 'axios';
import { Request, Response as ExpressResponse } from 'express';
import Api from '../models/api';
import ResponseModel from '../models/response';
import jwt from 'jsonwebtoken';

// Liste des noms d'API possibles avec leurs URL (API Statique) 
const apiEndpoints = [
  { name: 'getProductById', url: 'https://fakestoreapi.com/products/{id}' },
  { name: 'getProductsList', url: 'https://fakestoreapi.com/products' },
  { name: 'getProductReviews', url: 'https://fakestoreapi.com/products/{id}/reviews' },
  { name: 'getProductCategory', url: 'https://fakestoreapi.com/products/category/{category}' },
  { name: 'getProductDetails', url: 'https://fakestoreapi.com/products/{id}' }
];

// Définir le type de params
interface Params {
  [key: string]: string;
}

// Fonction pour normaliser les clés des paramètres
const normalizeParams = (params: Params) => {
  const normalized: Params = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      normalized[key.toLowerCase()] = params[key];
    }
  }
  return normalized;
};

export const fetchAndSaveApis = async (req: Request, res: ExpressResponse) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'fournisseur') {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }

    for (const api of apiEndpoints) {
      try {
        // Construct the URL with placeholders
        let apiUrl = api.url;
        let paramNames = '';

        // Extract parameters from the URL
        const urlParts = api.url.split('/');
        const placeholders = urlParts.filter(part => part.startsWith('{')).map(part => part.replace(/[{}]/g, ''));

        // Replace placeholders with values from request body
        const params: Params = {};
        for (const paramName of placeholders) {
          const paramValue = req.body[paramName] ;
          apiUrl = apiUrl.replace(`{${paramName}}`, paramValue);
          params[paramName] = paramValue;
          paramNames += paramName + ',';
        }

        paramNames = paramNames.slice(0, -1); // Remove trailing comma

        // Normalize parameters
        const normalizedParams = JSON.stringify(normalizeParams(params));

        // Fetch data from the dynamically constructed API endpoint
        const response = await axios.get(apiUrl);
        const apiData = response.data;

        const existingApi = await Api.findOne({
          where: { name: api.name, endPoint: api.url }
        });

        // Save the API if it does not already exist
        if (!existingApi) {
          const savedApi = await Api.create({
            name: api.name,
            endPoint: api.url,
            method: 'GET',
            params: paramNames, // Save only the names of parameters
            userId: decoded.id
          });

          console.log('Saved API:', savedApi); // Log the saved API

          const savedResponse = await ResponseModel.create({
            apiId: savedApi.id,
            data: JSON.stringify(apiData),
            params: normalizedParams
          });

          console.log('Saved Response:', savedResponse); // Log the saved response
        } else {
          // If API exists, check if the response with the same category already exists
          const existingResponse = await ResponseModel.findOne({
            where: { apiId: existingApi.id, params: normalizedParams }
          });

          if (!existingResponse) {
            const savedResponse = await ResponseModel.create({
              apiId: existingApi.id,
              data: JSON.stringify(apiData),
              params: normalizedParams
            });

            console.log('Saved Response:', savedResponse); // Log the saved response
          }
        }
      } catch (apiError) {
        console.error(`Error fetching from ${api.url}:`, apiError);
      }
    }

    return res.status(200).json({ message: 'APIs and responses saved successfully' });
  } catch (err) {
    console.error('Error fetching and saving APIs:', err);
    return res.status(500).json({ message: 'Internal server error', error: (err as Error).message });
  }
};
