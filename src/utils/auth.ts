import config from '@/config';
import jwt from 'jsonwebtoken';

export const createJwtToken = (data: any): string => {
	return jwt.sign(data, config.jwt.secret);
};

export const validateJwtToken = (token: string): any => {
	return jwt.verify(token, config.jwt.secret);
};