import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as urlService from '../services/url.service.js';

export const createUrl = asyncHandler(async (req, res) => {
  const url = await urlService.createShortUrl(req.user!._id.toString(), req.body);
  res.status(201).json(new ApiResponse({ url }, 'Short URL created successfully'));
});

export const listUrls = asyncHandler(async (req, res) => {
  const { urls, pagination } = await urlService.listUrls(req.user!._id.toString(), req.query as never);
  res.status(200).json(new ApiResponse({ urls, pagination }));
});

export const getUrl = asyncHandler(async (req, res) => {
  const url = await urlService.getUrlById(req.user!._id.toString(), String(req.params.id));
  res.status(200).json(new ApiResponse({ url }));
});

export const updateUrl = asyncHandler(async (req, res) => {
  const url = await urlService.updateUrl(req.user!._id.toString(), String(req.params.id), req.body);
  res.status(200).json(new ApiResponse({ url }, 'URL updated successfully'));
});

export const deleteUrl = asyncHandler(async (req, res) => {
  await urlService.deleteUrl(req.user!._id.toString(), String(req.params.id));
  res.status(200).json(new ApiResponse(null, 'URL deleted successfully'));
});
