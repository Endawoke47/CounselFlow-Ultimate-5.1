import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

export interface CaseUpdatePayload {
  caseId: string;
  type: 'document_upload' | 'analysis_start' | 'analysis_progress' | 'analysis_complete' | 'analysis_error';
  message: string;
  data?: any;
  progress?: number;
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'cases',
})
export class CaseUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CaseUpdatesGateway.name);
  private connectedClients = new Map<string, { socket: Socket; userId: string; caseIds: Set<string> }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Extract user info from JWT token (in real implementation)
    const userId = this.extractUserFromToken(client.handshake.auth?.token);
    
    if (userId) {
      this.connectedClients.set(client.id, {
        socket: client,
        userId,
        caseIds: new Set(),
      });
      
      client.emit('connection_established', {
        message: 'Connected to case updates',
        timestamp: new Date(),
      });
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('subscribe_case')
  handleSubscribeCase(
    @MessageBody() data: { caseId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.caseIds.add(data.caseId);
      client.join(`case_${data.caseId}`);
      
      client.emit('subscribed_case', {
        caseId: data.caseId,
        message: `Subscribed to case ${data.caseId} updates`,
        timestamp: new Date(),
      });
      
      this.logger.log(`Client ${client.id} subscribed to case ${data.caseId}`);
    }
  }

  @SubscribeMessage('unsubscribe_case')
  handleUnsubscribeCase(
    @MessageBody() data: { caseId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.caseIds.delete(data.caseId);
      client.leave(`case_${data.caseId}`);
      
      client.emit('unsubscribed_case', {
        caseId: data.caseId,
        message: `Unsubscribed from case ${data.caseId} updates`,
        timestamp: new Date(),
      });
      
      this.logger.log(`Client ${client.id} unsubscribed from case ${data.caseId}`);
    }
  }

  // Methods to emit updates to subscribed clients
  emitDocumentUploadProgress(caseId: string, progress: number, filename: string) {
    const payload: CaseUpdatePayload = {
      caseId,
      type: 'document_upload',
      message: `Uploading ${filename}`,
      progress,
      timestamp: new Date(),
    };

    this.server.to(`case_${caseId}`).emit('case_update', payload);
    this.logger.log(`Emitted document upload progress for case ${caseId}: ${progress}%`);
  }

  emitAnalysisStarted(caseId: string, analysisType: string, analysisId: string) {
    const payload: CaseUpdatePayload = {
      caseId,
      type: 'analysis_start',
      message: `Started ${analysisType} analysis`,
      data: { analysisId, analysisType },
      timestamp: new Date(),
    };

    this.server.to(`case_${caseId}`).emit('case_update', payload);
    this.logger.log(`Emitted analysis started for case ${caseId}`);
  }

  emitAnalysisProgress(caseId: string, analysisId: string, progress: number, currentStep: string) {
    const payload: CaseUpdatePayload = {
      caseId,
      type: 'analysis_progress',
      message: `Processing: ${currentStep}`,
      data: { analysisId, currentStep },
      progress,
      timestamp: new Date(),
    };

    this.server.to(`case_${caseId}`).emit('case_update', payload);
    this.logger.log(`Emitted analysis progress for case ${caseId}: ${progress}%`);
  }

  emitAnalysisCompleted(caseId: string, analysisId: string, analysisType: string, results: any) {
    const payload: CaseUpdatePayload = {
      caseId,
      type: 'analysis_complete',
      message: `${analysisType} analysis completed`,
      data: { 
        analysisId, 
        analysisType,
        summary: results.summary,
        riskLevel: results.riskLevel,
        confidenceScore: results.confidenceScore,
      },
      progress: 100,
      timestamp: new Date(),
    };

    this.server.to(`case_${caseId}`).emit('case_update', payload);
    this.logger.log(`Emitted analysis completed for case ${caseId}`);
  }

  emitAnalysisError(caseId: string, analysisId: string, error: string) {
    const payload: CaseUpdatePayload = {
      caseId,
      type: 'analysis_error',
      message: `Analysis failed: ${error}`,
      data: { analysisId, error },
      timestamp: new Date(),
    };

    this.server.to(`case_${caseId}`).emit('case_update', payload);
    this.logger.log(`Emitted analysis error for case ${caseId}: ${error}`);
  }

  // Send update to specific user across all their subscribed cases
  emitUserUpdate(userId: string, message: string, data?: any) {
    for (const [clientId, clientInfo] of this.connectedClients.entries()) {
      if (clientInfo.userId === userId) {
        clientInfo.socket.emit('user_update', {
          message,
          data,
          timestamp: new Date(),
        });
      }
    }
  }

  // Broadcast system-wide updates
  emitSystemUpdate(message: string, data?: any) {
    this.server.emit('system_update', {
      message,
      data,
      timestamp: new Date(),
    });
    
    this.logger.log(`Broadcasted system update: ${message}`);
  }

  // Get connected clients count for a specific case
  getCaseSubscribersCount(caseId: string): number {
    const room = this.server.sockets.adapter.rooms.get(`case_${caseId}`);
    return room ? room.size : 0;
  }

  // Get all connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  private extractUserFromToken(token: string): string | null {
    // In a real implementation, you would verify and decode the JWT token
    // For now, return a placeholder
    if (token) {
      try {
        // TODO: Implement proper JWT verification
        return 'user_id_placeholder';
      } catch (error) {
        this.logger.error(`Failed to extract user from token: ${error.message}`);
        return null;
      }
    }
    return null;
  }
}