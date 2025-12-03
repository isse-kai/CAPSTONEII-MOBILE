import * as requestService from '../services/clientrequestservice'
import { ClientRequest } from '../types/client'

export async function saveClientRequestController(payload: ClientRequest) {
  return await requestService.saveClientRequest(payload)
}

export async function submitServiceRequestController(payload: ClientRequest) {
  return await requestService.submitServiceRequest(payload)
}

export async function ClientCancelRequestController(payload: ClientRequest) {
  return await requestService.ClientCancelRequest(payload)
}

export async function ClientServiceRateController(payload: ClientRequest) {
  return await requestService.ClientServiceRate(payload)
}