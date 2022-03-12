import { XhrResponse } from '@drupal-js-sdk/interfaces';
import { DrupalError } from '@drupal-js-sdk/error';

interface JsonErrorResponseType {
    code: number;
    error: string;
  }

export abstract class Client {

    public getDrupalError(response: XhrResponse): DrupalError {
        // Transform the error into an instance of DrupalError by trying to parse
        // the error string as JSON
        let error;
        const data = response.data;
        if (
            typeof data === 'string' ||
            typeof data === 'undefined' ||
            typeof data === 'number' ||
            typeof data === 'boolean'
        ) {
            error = new DrupalError(
                DrupalError.CONNECTION_FAILED,
                `Xhr method failed: ${data}`,
            );
        } else if (data.responseText === undefined) {
            error = new DrupalError(
                DrupalError.CONNECTION_FAILED,
                `Xhr method failed: ${JSON.stringify(data)}`,
            );
        } else if (typeof data.responseText === 'string') {
            try {
                const errorJSON: JsonErrorResponseType = JSON.parse(
                    data.responseText
                );
                error = new DrupalError(errorJSON.code, errorJSON.error);
            } catch (exception) {
                // If we fail to parse the error text, that's okay.
                error = new DrupalError(
                    DrupalError.INVALID_JSON,
                    `Received an error with invalid JSON from server: ${data.responseText}`,
                );
            }
        }
        else {
            error = new DrupalError(
                DrupalError.INVALID_JSON,
                `Received an error with invalid JSON from server: ${data.responseText}`,
            );
        }
        return error;
    }

}