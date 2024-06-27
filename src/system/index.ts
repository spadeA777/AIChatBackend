import { runServer } from './server';
import { SocketIO } from '@/socket';
import { logger, endLogger } from '@/utils/logger';

import { initializeMongo } from './mongo';

const initialize = async () => {
    initializeMongo();
}

export const runApplication = async () => {
    await initialize();

    const server = await runServer();
	SocketIO(server)

	// Manage application shutdown
	process.on('SIGINT', () => {
		logger.info('Stopping application...');
		endLogger();
		process.exit();
	});
};