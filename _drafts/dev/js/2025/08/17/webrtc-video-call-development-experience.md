---
title: 'WebRTC 화상 통화 서비스 개발 실전 가이드: React와 Next.js로 구현하는 완전한 솔루션'
date: '2025-08-17'
category: 'Javascript'
tags:
  [
    'WebRTC',
    'React',
    'Next.js',
    'Socket.io',
    'Video Call',
    'Real-time Communication',
    'Frontend',
    'Backend',
  ]
---

# WebRTC 화상 통화 서비스 개발 실전 가이드

최근 원격 근무의 확산과 함께 화상 통화 기능에 대한 수요가 급증했습니다. Zoom, Google Meet, Microsoft Teams 같은 서비스들이 일상이 되었지만, 자체 서비스에 화상 통화 기능을 직접 구현해야 하는 상황도 많아졌습니다. 이번 글에서는 WebRTC를 활용해 React와 Next.js로 화상 통화 서비스를 구현한 실무 경험을 공유하겠습니다.

## 1. WebRTC가 해결하는 문제와 중요성

### 전통적인 스트리밍의 한계

기존 영상 스트리밍은 대부분 서버를 경유하는 방식이었습니다. 모든 영상 데이터가 서버를 거쳐야 하므로 지연 시간(latency)이 길고, 서버 비용이 기하급수적으로 증가하는 문제가 있었습니다. 특히 실시간 통신이 중요한 화상 통화에서는 이러한 지연이 치명적입니다.

### WebRTC의 혁신적 접근

WebRTC(Web Real-Time Communication)는 브라우저 간 직접 통신을 가능하게 하는 표준 기술입니다. 서버를 거치지 않고 P2P(Peer-to-Peer) 방식으로 직접 연결하여 다음과 같은 장점을 제공합니다:

- **낮은 지연 시간**: 서버를 거치지 않아 100ms 이하의 초저지연 통신 구현 가능
- **서버 비용 절약**: 영상 데이터가 서버를 거치지 않아 대역폭 비용 대폭 절감
- **확장성**: 동시 접속자가 늘어나도 서버 부하가 선형적으로 증가하지 않음
- **보안성**: 기본적으로 암호화된 통신 제공

## 2. WebRTC 핵심 개념 이해하기

WebRTC를 제대로 활용하려면 몇 가지 핵심 개념을 이해해야 합니다.

### 2.1 MediaStream API

사용자의 카메라와 마이크에 접근하여 미디어 스트림을 생성하는 API입니다.

```javascript
// 사용자 미디어 획득
const getUserMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })
    return stream
  } catch (error) {
    console.error('미디어 접근 실패:', error)
    throw error
  }
}
```

### 2.2 RTCPeerConnection

실제 P2P 연결을 담당하는 핵심 객체입니다. 연결 설정, 미디어 전송, 데이터 채널 등을 관리합니다.

```javascript
// PeerConnection 설정
const createPeerConnection = () => {
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com:3478',
        username: 'username',
        credential: 'password',
      },
    ],
    iceCandidatePoolSize: 10,
  }

  return new RTCPeerConnection(configuration)
}
```

### 2.3 시그널링 (Signaling)

P2P 연결을 설정하기 위해 초기 정보를 교환하는 과정입니다. WebRTC 표준에 포함되지 않아 개발자가 직접 구현해야 합니다.

### 2.4 SDP (Session Description Protocol)

연결할 미디어의 형식, 코덱, 네트워크 정보 등을 기술하는 프로토콜입니다.

### 2.5 ICE Candidate

실제 네트워크 연결 경로를 나타내는 정보입니다. NAT/방화벽을 우회하여 최적의 연결 경로를 찾습니다.

## 3. React 컴포넌트 구현: 화상 통화 UI

### 3.1 기본 비디오 컴포넌트 구조

```tsx
// components/VideoCall.tsx
import React, { useRef, useEffect, useState } from 'react'
import { useWebRTC } from '../hooks/useWebRTC'
import { useMediaControl } from '../hooks/useMediaControl'

interface VideoCallProps {
  roomId: string
  onCallEnd?: () => void
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, onCallEnd }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const {
    localStream,
    remoteStream,
    isConnected,
    connectionState,
    joinRoom,
    leaveRoom,
    error,
  } = useWebRTC(roomId)

  const { isMuted, isVideoOff, toggleMute, toggleVideo, switchCamera } =
    useMediaControl(localStream)

  // 로컬 비디오 스트림 설정
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // 원격 비디오 스트림 설정
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  // 컴포넌트 마운트 시 방 참여
  useEffect(() => {
    joinRoom()

    return () => {
      leaveRoom()
    }
  }, [joinRoom, leaveRoom])

  return (
    <div className="video-call-container">
      {/* 연결 상태 표시 */}
      <div className="connection-status">
        <span className={`status-indicator ${connectionState}`}>
          {connectionState === 'connected' ? '연결됨' : '연결 중...'}
        </span>
      </div>

      {/* 비디오 영역 */}
      <div className="video-layout">
        {/* 원격 비디오 (메인) */}
        <div className="remote-video-container">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
          {!isConnected && (
            <div className="waiting-message">상대방을 기다리는 중...</div>
          )}
        </div>

        {/* 로컬 비디오 (PIP) */}
        <div className="local-video-container">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video"
          />
          {isVideoOff && <div className="video-off-indicator">카메라 꺼짐</div>}
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="control-panel">
        <button
          onClick={toggleMute}
          className={`control-button ${isMuted ? 'muted' : ''}`}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>

        <button
          onClick={toggleVideo}
          className={`control-button ${isVideoOff ? 'video-off' : ''}`}
        >
          {isVideoOff ? '📹' : '📷'}
        </button>

        <button onClick={switchCamera} className="control-button">
          🔄
        </button>

        <button onClick={onCallEnd} className="control-button end-call">
          📞
        </button>
      </div>

      {/* 에러 표시 */}
      {error && <div className="error-message">오류: {error.message}</div>}
    </div>
  )
}

export default VideoCall
```

### 3.2 WebRTC 커스텀 훅 구현

```tsx
// hooks/useWebRTC.ts
import { useState, useCallback, useRef, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseWebRTCReturn {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isConnected: boolean
  connectionState: RTCPeerConnectionState
  joinRoom: () => Promise<void>
  leaveRoom: () => void
  error: Error | null
}

export const useWebRTC = (roomId: string): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] =
    useState<RTCPeerConnectionState>('new')
  const [error, setError] = useState<Error | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // PeerConnection 생성
  const createPeerConnection = useCallback(() => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // TURN 서버 설정 (프로덕션 환경에서 필수)
        {
          urls: 'turn:your-turn-server.com:3478',
          username: process.env.NEXT_PUBLIC_TURN_USERNAME,
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
        },
      ],
      iceCandidatePoolSize: 10,
    }

    const peerConnection = new RTCPeerConnection(configuration)

    // 연결 상태 변경 감지
    peerConnection.onconnectionstatechange = () => {
      setConnectionState(peerConnection.connectionState)
      setIsConnected(peerConnection.connectionState === 'connected')
    }

    // 원격 스트림 수신
    peerConnection.ontrack = event => {
      const [stream] = event.streams
      setRemoteStream(stream)
    }

    // ICE candidate 이벤트 처리
    peerConnection.onicecandidate = event => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
        })
      }
    }

    return peerConnection
  }, [roomId])

  // 소켓 연결 설정
  const setupSocket = useCallback(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    )

    socket.on('user-joined', async () => {
      if (peerConnectionRef.current && localStream) {
        const offer = await peerConnectionRef.current.createOffer()
        await peerConnectionRef.current.setLocalDescription(offer)

        socket.emit('offer', {
          roomId,
          offer: offer,
        })
      }
    })

    socket.on('offer', async data => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.offer)
        const answer = await peerConnectionRef.current.createAnswer()
        await peerConnectionRef.current.setLocalDescription(answer)

        socket.emit('answer', {
          roomId,
          answer: answer,
        })
      }
    })

    socket.on('answer', async data => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.answer)
      }
    })

    socket.on('ice-candidate', async data => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(data.candidate)
      }
    })

    socket.on('user-left', () => {
      setRemoteStream(null)
      setIsConnected(false)
    })

    return socket
  }, [roomId, localStream])

  // 방 참여
  const joinRoom = useCallback(async () => {
    try {
      // 미디어 스트림 획득
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      setLocalStream(stream)

      // PeerConnection 생성 및 스트림 추가
      const peerConnection = createPeerConnection()
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
      })
      peerConnectionRef.current = peerConnection

      // 소켓 연결
      const socket = setupSocket()
      socketRef.current = socket

      // 방 참여 신호 전송
      socket.emit('join-room', roomId)
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error('방 참여 실패:', error)
    }
  }, [roomId, createPeerConnection, setupSocket])

  // 방 나가기
  const leaveRoom = useCallback(() => {
    // 로컬 스트림 정리
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    // PeerConnection 정리
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // 소켓 연결 정리
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId)
      socketRef.current.disconnect()
      socketRef.current = null
    }

    setRemoteStream(null)
    setIsConnected(false)
    setConnectionState('closed')
  }, [localStream, roomId])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      leaveRoom()
    }
  }, [leaveRoom])

  return {
    localStream,
    remoteStream,
    isConnected,
    connectionState,
    joinRoom,
    leaveRoom,
    error,
  }
}
```

### 3.3 미디어 컨트롤 훅

```tsx
// hooks/useMediaControl.ts
import { useState, useCallback } from 'react'

interface UseMediaControlReturn {
  isMuted: boolean
  isVideoOff: boolean
  currentCamera: 'user' | 'environment'
  toggleMute: () => void
  toggleVideo: () => void
  switchCamera: () => Promise<void>
}

export const useMediaControl = (
  stream: MediaStream | null
): UseMediaControlReturn => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [currentCamera, setCurrentCamera] = useState<'user' | 'environment'>(
    'user'
  )

  const toggleMute = useCallback(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }, [stream, isMuted])

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }, [stream, isVideoOff])

  const switchCamera = useCallback(async () => {
    if (!stream) return

    try {
      const newFacingMode = currentCamera === 'user' ? 'environment' : 'user'

      // 기존 비디오 트랙 정지
      const videoTracks = stream.getVideoTracks()
      videoTracks.forEach(track => track.stop())

      // 새로운 비디오 스트림 획득
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: false,
      })

      // 기존 비디오 트랙 제거 및 새 트랙 추가
      const newVideoTrack = newStream.getVideoTracks()[0]
      stream.removeTrack(videoTracks[0])
      stream.addTrack(newVideoTrack)

      setCurrentCamera(newFacingMode)
    } catch (error) {
      console.error('카메라 전환 실패:', error)
    }
  }, [stream, currentCamera])

  return {
    isMuted,
    isVideoOff,
    currentCamera,
    toggleMute,
    toggleVideo,
    switchCamera,
  }
}
```

## 4. Next.js 시그널링 서버 구현

WebRTC는 P2P 연결을 위해 초기 연결 정보를 교환하는 시그널링 서버가 필요합니다. Next.js와 Socket.io를 활용해 구현해보겠습니다.

### 4.1 Socket.io 서버 설정

```typescript
// server/socket-server.ts
import { Server } from 'socket.io'
import { createServer } from 'http'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

interface RoomData {
  users: Set<string>
  createdAt: Date
}

interface IceCandidate {
  candidate: string
  sdpMLineIndex: number
  sdpMid: string
}

export const startSocketServer = async () => {
  await app.prepare()

  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  // 방 정보 저장
  const rooms = new Map<string, RoomData>()

  // 연결 이벤트 처리
  io.on('connection', socket => {
    console.log(`사용자 연결: ${socket.id}`)

    // 방 참여
    socket.on('join-room', (roomId: string) => {
      console.log(`${socket.id}가 방 ${roomId}에 참여`)

      // 방이 없으면 생성
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          users: new Set(),
          createdAt: new Date(),
        })
      }

      const room = rooms.get(roomId)!

      // 방이 가득 찬 경우 (2명 제한)
      if (room.users.size >= 2) {
        socket.emit('room-full')
        return
      }

      // 기존 사용자에게 새 사용자 참여 알림
      socket.to(roomId).emit('user-joined', socket.id)

      // 방 참여
      socket.join(roomId)
      room.users.add(socket.id)

      // 참여 확인 전송
      socket.emit('joined-room', roomId)
    })

    // Offer 전달
    socket.on(
      'offer',
      (data: { roomId: string; offer: RTCSessionDescriptionInit }) => {
        console.log(`Offer 수신: ${socket.id} -> 방 ${data.roomId}`)
        socket.to(data.roomId).emit('offer', {
          offer: data.offer,
          senderId: socket.id,
        })
      }
    )

    // Answer 전달
    socket.on(
      'answer',
      (data: { roomId: string; answer: RTCSessionDescriptionInit }) => {
        console.log(`Answer 수신: ${socket.id} -> 방 ${data.roomId}`)
        socket.to(data.roomId).emit('answer', {
          answer: data.answer,
          senderId: socket.id,
        })
      }
    )

    // ICE Candidate 전달
    socket.on(
      'ice-candidate',
      (data: { roomId: string; candidate: IceCandidate }) => {
        socket.to(data.roomId).emit('ice-candidate', {
          candidate: data.candidate,
          senderId: socket.id,
        })
      }
    )

    // 방 나가기
    socket.on('leave-room', (roomId: string) => {
      leaveRoom(socket.id, roomId)
    })

    // 연결 끊김 처리
    socket.on('disconnect', () => {
      console.log(`사용자 연결 끊김: ${socket.id}`)

      // 모든 방에서 사용자 제거
      rooms.forEach((room, roomId) => {
        if (room.users.has(socket.id)) {
          leaveRoom(socket.id, roomId)
        }
      })
    })

    // 방 나가기 헬퍼 함수
    const leaveRoom = (socketId: string, roomId: string) => {
      const room = rooms.get(roomId)
      if (room) {
        room.users.delete(socketId)

        // 방이 비었으면 삭제
        if (room.users.size === 0) {
          rooms.delete(roomId)
          console.log(`빈 방 삭제: ${roomId}`)
        } else {
          // 다른 사용자에게 나감 알림
          socket.to(roomId).emit('user-left', socketId)
        }
      }

      socket.leave(roomId)
    }
  })

  // 방 정리 작업 (1시간마다)
  setInterval(
    () => {
      const now = new Date()
      rooms.forEach((room, roomId) => {
        const hoursSinceCreation =
          (now.getTime() - room.createdAt.getTime()) / (1000 * 60 * 60)
        if (hoursSinceCreation > 1) {
          rooms.delete(roomId)
          console.log(`오래된 방 삭제: ${roomId}`)
        }
      })
    },
    60 * 60 * 1000
  ) // 1시간

  const PORT = process.env.PORT || 3001
  server.listen(PORT, () => {
    console.log(`시그널링 서버 시작: http://localhost:${PORT}`)
  })
}

// 서버 시작
if (require.main === module) {
  startSocketServer().catch(console.error)
}
```

### 4.2 Next.js API Routes 활용

```typescript
// pages/api/rooms/[roomId].ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface RoomInfo {
  id: string
  participantCount: number
  maxParticipants: number
  createdAt: string
  isActive: boolean
}

// 메모리 기반 방 정보 저장 (프로덕션에서는 Redis 등 사용)
const roomsStore = new Map<string, RoomInfo>()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query

  if (typeof roomId !== 'string') {
    return res.status(400).json({ error: '잘못된 방 ID' })
  }

  switch (req.method) {
    case 'GET':
      // 방 정보 조회
      const room = roomsStore.get(roomId)
      if (!room) {
        return res.status(404).json({ error: '방을 찾을 수 없습니다' })
      }
      return res.status(200).json(room)

    case 'POST':
      // 방 생성
      if (roomsStore.has(roomId)) {
        return res.status(409).json({ error: '이미 존재하는 방입니다' })
      }

      const newRoom: RoomInfo = {
        id: roomId,
        participantCount: 0,
        maxParticipants: 2,
        createdAt: new Date().toISOString(),
        isActive: true,
      }

      roomsStore.set(roomId, newRoom)
      return res.status(201).json(newRoom)

    case 'DELETE':
      // 방 삭제
      if (!roomsStore.has(roomId)) {
        return res.status(404).json({ error: '방을 찾을 수 없습니다' })
      }

      roomsStore.delete(roomId)
      return res.status(200).json({ message: '방이 삭제되었습니다' })

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

### 4.3 환경별 설정 관리

```typescript
// config/webrtc.config.ts
interface WebRTCConfig {
  iceServers: RTCIceServer[]
  socketUrl: string
  turnCredential?: {
    username: string
    password: string
  }
}

const getWebRTCConfig = (): WebRTCConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const baseConfig: WebRTCConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
    socketUrl: isDevelopment
      ? 'http://localhost:3001'
      : process.env.NEXT_PUBLIC_SOCKET_URL || 'wss://your-domain.com',
  }

  // 프로덕션 환경에서 TURN 서버 추가
  if (!isDevelopment) {
    const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME
    const turnPassword = process.env.NEXT_PUBLIC_TURN_PASSWORD
    const turnUrl = process.env.NEXT_PUBLIC_TURN_URL

    if (turnUsername && turnPassword && turnUrl) {
      baseConfig.iceServers.push({
        urls: turnUrl,
        username: turnUsername,
        credential: turnPassword,
      })

      baseConfig.turnCredential = {
        username: turnUsername,
        password: turnPassword,
      }
    }
  }

  return baseConfig
}

export default getWebRTCConfig
```

## 5. 성능 최적화와 브라우저 호환성

### 5.1 코덱 최적화

```typescript
// utils/codecOptimization.ts
export const optimizeRTCConfiguration = (): RTCConfiguration => {
  const isLowEndDevice = navigator.hardwareConcurrency < 4
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  return {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    // 저사양 기기에서 ICE 수집 시간 단축
    iceCandidatePoolSize: isLowEndDevice ? 5 : 10,
    // 번들 정책 설정으로 대역폭 절약
    bundlePolicy: 'max-bundle',
    // RTCP mux로 포트 사용량 최적화
    rtcpMuxPolicy: 'require',
  }
}

// SDP 조작을 통한 코덱 우선순위 설정
export const preferCodec = (sdp: string, codecName: string): string => {
  const lines = sdp.split('\r\n')
  let mLineIndex = -1

  // m=video 라인 찾기
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('m=video')) {
      mLineIndex = i
      break
    }
  }

  if (mLineIndex === -1) return sdp

  // 선호하는 코덱의 페이로드 타입 찾기
  const codecPattern = new RegExp(`a=rtpmap:(\\d+) ${codecName}`, 'i')
  let codecPayloadType = ''

  for (let i = mLineIndex + 1; i < lines.length; i++) {
    if (lines[i].startsWith('m=')) break

    const match = lines[i].match(codecPattern)
    if (match) {
      codecPayloadType = match[1]
      break
    }
  }

  if (!codecPayloadType) return sdp

  // m=video 라인에서 코덱 순서 조정
  const mLine = lines[mLineIndex]
  const elements = mLine.split(' ')
  const payloadTypes = elements.slice(3)

  // 선호 코덱을 맨 앞으로 이동
  const reorderedPayloads = [
    codecPayloadType,
    ...payloadTypes.filter(pt => pt !== codecPayloadType),
  ]
  const newMLine = elements.slice(0, 3).concat(reorderedPayloads).join(' ')

  lines[mLineIndex] = newMLine
  return lines.join('\r\n')
}

// 모바일 환경 최적화
export const getMobileOptimizedConstraints = () => ({
  video: {
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 },
    frameRate: { ideal: 15, max: 30 }, // 모바일에서 프레임율 제한
    facingMode: 'user',
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 16000, // 오디오 품질 조정
  },
})
```

### 5.2 네트워크 적응형 품질 조정

```typescript
// hooks/useAdaptiveQuality.ts
import { useEffect, useRef } from 'react'

interface NetworkStats {
  bandwidth: number
  rtt: number
  packetLoss: number
}

export const useAdaptiveQuality = (
  peerConnection: RTCPeerConnection | null
) => {
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!peerConnection) return

    const monitorConnection = async () => {
      try {
        const stats = await peerConnection.getStats()
        const networkStats = analyzeStats(stats)

        // 네트워크 상태에 따른 품질 조정
        if (networkStats.bandwidth < 500000) {
          // 500kbps 미만
          await adjustVideoQuality(peerConnection, 'low')
        } else if (networkStats.bandwidth < 1500000) {
          // 1.5Mbps 미만
          await adjustVideoQuality(peerConnection, 'medium')
        } else {
          await adjustVideoQuality(peerConnection, 'high')
        }
      } catch (error) {
        console.error('Stats 모니터링 오류:', error)
      }
    }

    // 5초마다 네트워크 상태 체크
    statsIntervalRef.current = setInterval(monitorConnection, 5000)

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current)
      }
    }
  }, [peerConnection])

  const analyzeStats = (stats: RTCStatsReport): NetworkStats => {
    let bandwidth = 0
    let rtt = 0
    let packetLoss = 0

    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        bandwidth = ((report.bytesReceived * 8) / report.timestamp) * 1000
      }

      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        rtt = report.currentRoundTripTime * 1000
      }

      if (report.type === 'inbound-rtp') {
        const packetsReceived = report.packetsReceived || 0
        const packetsLost = report.packetsLost || 0
        packetLoss = (packetsLost / (packetsReceived + packetsLost)) * 100
      }
    })

    return { bandwidth, rtt, packetLoss }
  }

  const adjustVideoQuality = async (
    pc: RTCPeerConnection,
    quality: 'low' | 'medium' | 'high'
  ) => {
    const sender = pc
      .getSenders()
      .find(s => s.track && s.track.kind === 'video')

    if (!sender) return

    const params = sender.getParameters()
    if (!params.encodings || params.encodings.length === 0) return

    // 품질에 따른 비트레이트 조정
    const maxBitrates = {
      low: 300000, // 300kbps
      medium: 800000, // 800kbps
      high: 2000000, // 2Mbps
    }

    params.encodings[0].maxBitrate = maxBitrates[quality]

    try {
      await sender.setParameters(params)
      console.log(`비디오 품질 조정: ${quality} (${maxBitrates[quality]}bps)`)
    } catch (error) {
      console.error('비트레이트 조정 실패:', error)
    }
  }
}
```

### 5.3 인앱브라우저 대응

```typescript
// utils/browserDetection.ts
interface BrowserInfo {
  isInAppBrowser: boolean;
  browserName: string;
  needsPolyfill: boolean;
  supportLevel: 'full' | 'limited' | 'none';
}

export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;

  // 인앱브라우저 감지
  const isKakaoTalk = /KAKAOTALK/i.test(userAgent);
  const isNaverApp = /NAVER/i.test(userAgent);
  const isLineApp = /Line/i.test(userAgent);
  const isFacebookApp = /FBAN|FBAV/i.test(userAgent);
  const isInstagram = /Instagram/i.test(userAgent);

  const isInAppBrowser = isKakaoTalk || isNaverApp || isLineApp || isFacebookApp || isInstagram;

  // 브라우저별 WebRTC 지원 수준
  let supportLevel: 'full' | 'limited' | 'none' = 'full';
  let browserName = 'unknown';

  if (isKakaoTalk) {
    browserName = 'KakaoTalk';
    supportLevel = 'limited'; // getUserMedia 제한
  } else if (isNaverApp) {
    browserName = 'Naver';
    supportLevel = 'limited';
  } else if (/Chrome/i.test(userAgent)) {
    browserName = 'Chrome';
    supportLevel = 'full';
  } else if (/Safari/i.test(userAgent)) {
    browserName = 'Safari';
    supportLevel = 'full';
  } else if (/Firefox/i.test(userAgent)) {
    browserName = 'Firefox';
    supportLevel = 'full';
  }

  return {
    isInAppBrowser,
    browserName,
    needsPolyfill: isInAppBrowser,
    supportLevel
  };
};

// 인앱브라우저 대응 컴포넌트
export const InAppBrowserGuide: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    setBrowserInfo(detectBrowser());
  }, []);

  if (!browserInfo?.isInAppBrowser) return null;

  const openInBrowser = () => {
    const currentUrl = window.location.href;

    if (browserInfo.browserName === 'KakaoTalk') {
      // 카카오톡에서 외부 브라우저로 열기
      window.open(`kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`);
    } else {
      // 다른 인앱브라우저에서 복사 안내
      navigator.clipboard?.writeText(currentUrl);
      alert('URL이 복사되었습니다. 브라우저에서 붙여넣기 해주세요.');
    }
  };

  return (
    <div className="in-app-browser-guide">
      <div className="guide-content">
        <h3>브라우저에서 열어주세요</h3>
        <p>
          현재 {browserInfo.browserName} 앱 내부 브라우저에서는
          화상 통화 기능이 제한될 수 있습니다.
        </p>
        <button onClick={openInBrowser} className="open-browser-btn">
          브라우저에서 열기
        </button>
      </div>
    </div>
  );
};
```

## 6. 실무 팁과 개발 중 마주한 함정들

### 6.1 미디어 권한 처리

```typescript
// utils/mediaPermissions.ts
export enum PermissionError {
  DENIED = 'permission-denied',
  NOT_FOUND = 'device-not-found',
  NOT_SUPPORTED = 'not-supported',
  OVER_CONSTRAINED = 'over-constrained',
}

export const checkMediaPermissions = async (): Promise<{
  video: boolean
  audio: boolean
  errors: PermissionError[]
}> => {
  const errors: PermissionError[] = []
  let hasVideo = false
  let hasAudio = false

  // 카메라 권한 체크
  try {
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })
    hasVideo = true
    videoStream.getTracks().forEach(track => track.stop())
  } catch (error: any) {
    console.error('카메라 권한 오류:', error)
    if (error.name === 'NotAllowedError') {
      errors.push(PermissionError.DENIED)
    } else if (error.name === 'NotFoundError') {
      errors.push(PermissionError.NOT_FOUND)
    } else if (error.name === 'NotSupportedError') {
      errors.push(PermissionError.NOT_SUPPORTED)
    }
  }

  // 마이크 권한 체크
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    })
    hasAudio = true
    audioStream.getTracks().forEach(track => track.stop())
  } catch (error: any) {
    console.error('마이크 권한 오류:', error)
    // 오디오 권한 오류는 별도로 처리하지 않음 (비디오만으로도 통화 가능)
  }

  return { video: hasVideo, audio: hasAudio, errors }
}

// 권한 요청 재시도 로직
export const requestMediaWithRetry = async (
  constraints: MediaStreamConstraints,
  maxRetries: number = 3
): Promise<MediaStream> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error: any) {
      console.error(`미디어 요청 실패 (시도 ${attempt}/${maxRetries}):`, error)

      if (attempt === maxRetries) {
        throw error
      }

      // 제약 조건을 점진적으로 완화
      if (error.name === 'OverconstrainedError') {
        constraints = relaxConstraints(constraints)
      }

      // 잠시 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw new Error('미디어 요청 최대 재시도 횟수 초과')
}

const relaxConstraints = (
  constraints: MediaStreamConstraints
): MediaStreamConstraints => {
  const relaxed = { ...constraints }

  if (relaxed.video && typeof relaxed.video === 'object') {
    // 해상도 제약 완화
    delete relaxed.video.width
    delete relaxed.video.height
    delete relaxed.video.frameRate
  }

  return relaxed
}
```

### 6.2 연결 실패 시 자동 복구

```typescript
// hooks/useConnectionRecovery.ts
import { useCallback, useRef, useEffect } from 'react'

interface ConnectionRecoveryOptions {
  maxRetries: number
  retryDelay: number
  onRecoveryAttempt?: (attempt: number) => void
  onRecoverySuccess?: () => void
  onRecoveryFailed?: () => void
}

export const useConnectionRecovery = (
  peerConnection: RTCPeerConnection | null,
  options: ConnectionRecoveryOptions
) => {
  const retryCountRef = useRef(0)
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRecoveringRef = useRef(false)

  const attemptRecovery = useCallback(async () => {
    if (!peerConnection || isRecoveringRef.current) return

    const {
      maxRetries,
      retryDelay,
      onRecoveryAttempt,
      onRecoverySuccess,
      onRecoveryFailed,
    } = options

    if (retryCountRef.current >= maxRetries) {
      onRecoveryFailed?.()
      return
    }

    isRecoveringRef.current = true
    retryCountRef.current++

    onRecoveryAttempt?.(retryCountRef.current)

    try {
      // ICE 재시작 시도
      const offer = await peerConnection.createOffer({ iceRestart: true })
      await peerConnection.setLocalDescription(offer)

      // 시그널링 서버를 통해 새로운 offer 전송
      // (실제 구현에서는 socket을 통해 전송)

      // 연결 상태 확인을 위한 타이머 설정
      recoveryTimeoutRef.current = setTimeout(() => {
        if (peerConnection.connectionState === 'connected') {
          retryCountRef.current = 0
          isRecoveringRef.current = false
          onRecoverySuccess?.()
        } else {
          isRecoveringRef.current = false
          // 재귀적으로 다시 시도
          setTimeout(() => attemptRecovery(), retryDelay)
        }
      }, 5000)
    } catch (error) {
      console.error('연결 복구 실패:', error)
      isRecoveringRef.current = false
      setTimeout(() => attemptRecovery(), retryDelay)
    }
  }, [peerConnection, options])

  useEffect(() => {
    if (!peerConnection) return

    const handleConnectionStateChange = () => {
      const state = peerConnection.connectionState
      console.log('연결 상태 변경:', state)

      if (state === 'failed' || state === 'disconnected') {
        console.log('연결 실패 감지, 복구 시도 시작')
        attemptRecovery()
      } else if (state === 'connected') {
        // 연결 성공 시 재시도 카운터 리셋
        retryCountRef.current = 0
        isRecoveringRef.current = false

        if (recoveryTimeoutRef.current) {
          clearTimeout(recoveryTimeoutRef.current)
          recoveryTimeoutRef.current = null
        }
      }
    }

    peerConnection.addEventListener(
      'connectionstatechange',
      handleConnectionStateChange
    )

    return () => {
      peerConnection.removeEventListener(
        'connectionstatechange',
        handleConnectionStateChange
      )
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current)
      }
    }
  }, [peerConnection, attemptRecovery])

  return {
    isRecovering: isRecoveringRef.current,
    retryCount: retryCountRef.current,
    attemptRecovery,
  }
}
```

### 6.3 메모리 누수 방지

```typescript
// hooks/useCleanup.ts
import { useEffect, useRef } from 'react'

export const useCleanup = () => {
  const resourcesRef = useRef<Array<() => void>>([])

  const addCleanupTask = useCallback((cleanup: () => void) => {
    resourcesRef.current.push(cleanup)
  }, [])

  const cleanupAll = useCallback(() => {
    resourcesRef.current.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.error('Cleanup 실행 중 오류:', error)
      }
    })
    resourcesRef.current = []
  }, [])

  useEffect(() => {
    return () => {
      cleanupAll()
    }
  }, [cleanupAll])

  return { addCleanupTask, cleanupAll }
}

// 사용 예시
const VideoCallComponent = () => {
  const { addCleanupTask } = useCleanup()

  useEffect(() => {
    const setupWebRTC = async () => {
      // 미디어 스트림 생성
      const stream = await getUserMedia()
      addCleanupTask(() => {
        stream.getTracks().forEach(track => track.stop())
      })

      // PeerConnection 생성
      const pc = new RTCPeerConnection(config)
      addCleanupTask(() => {
        pc.close()
      })

      // Socket 연결
      const socket = io(socketUrl)
      addCleanupTask(() => {
        socket.disconnect()
      })
    }

    setupWebRTC()
  }, [addCleanupTask])
}
```

### 6.4 성능 모니터링

```typescript
// utils/performanceMonitor.ts
interface PerformanceMetrics {
  videoResolution: { width: number; height: number }
  frameRate: number
  bitrate: number
  packetLoss: number
  jitter: number
  rtt: number
}

export class WebRTCPerformanceMonitor {
  private peerConnection: RTCPeerConnection
  private metrics: PerformanceMetrics | null = null
  private monitoringInterval: NodeJS.Timeout | null = null

  constructor(peerConnection: RTCPeerConnection) {
    this.peerConnection = peerConnection
  }

  startMonitoring(intervalMs: number = 5000): void {
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics()
    }, intervalMs)
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
  }

  private async collectMetrics(): Promise<void> {
    try {
      const stats = await this.peerConnection.getStats()
      const metrics = this.parseStats(stats)

      this.metrics = metrics
      this.reportMetrics(metrics)
    } catch (error) {
      console.error('메트릭 수집 실패:', error)
    }
  }

  private parseStats(stats: RTCStatsReport): PerformanceMetrics {
    let videoResolution = { width: 0, height: 0 }
    let frameRate = 0
    let bitrate = 0
    let packetLoss = 0
    let jitter = 0
    let rtt = 0

    stats.forEach(report => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        videoResolution.width = report.frameWidth || 0
        videoResolution.height = report.frameHeight || 0
        frameRate = report.framesPerSecond || 0

        // 비트레이트 계산 (바이트/초 -> 비트/초)
        const bytesReceived = report.bytesReceived || 0
        const timestamp = report.timestamp || 0
        bitrate = (bytesReceived * 8) / (timestamp / 1000)

        // 패킷 손실률 계산
        const packetsReceived = report.packetsReceived || 0
        const packetsLost = report.packetsLost || 0
        packetLoss = (packetsLost / (packetsReceived + packetsLost)) * 100

        jitter = report.jitter || 0
      }

      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        rtt = (report.currentRoundTripTime || 0) * 1000 // 초 -> 밀리초
      }
    })

    return {
      videoResolution,
      frameRate,
      bitrate,
      packetLoss,
      jitter,
      rtt,
    }
  }

  private reportMetrics(metrics: PerformanceMetrics): void {
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.table({
        해상도: `${metrics.videoResolution.width}x${metrics.videoResolution.height}`,
        프레임율: `${metrics.frameRate.toFixed(1)}fps`,
        비트레이트: `${(metrics.bitrate / 1000).toFixed(1)}kbps`,
        패킷손실: `${metrics.packetLoss.toFixed(2)}%`,
        지터: `${metrics.jitter.toFixed(2)}ms`,
        RTT: `${metrics.rtt.toFixed(1)}ms`,
      })
    }

    // 프로덕션 환경에서는 모니터링 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metrics)
    }
  }

  private sendToMonitoringService(metrics: PerformanceMetrics): void {
    // 실제 프로덕션에서는 DataDog, New Relic 등으로 전송
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: Date.now(),
        metrics,
        userAgent: navigator.userAgent,
      }),
    }).catch(error => {
      console.error('메트릭 전송 실패:', error)
    })
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics
  }
}
```

## 7. 배운 점과 앞으로의 발전 방향

### 7.1 개발 과정에서 얻은 핵심 인사이트

**WebRTC의 복잡성 이해**: WebRTC는 단순히 API를 호출하는 것이 아니라, 네트워크 환경, 브라우저 차이, 디바이스 성능 등 다양한 변수를 고려해야 하는 복합적인 기술입니다. 특히 한국의 네트워크 환경에서는 TURN 서버가 거의 필수적이라는 점을 깨달았습니다.

**상태 관리의 중요성**: 연결 상태, 미디어 상태, 에러 상태 등을 체계적으로 관리하지 않으면 사용자 경험이 크게 떨어집니다. Redux나 Zustand 같은 상태 관리 라이브러리를 활용하여 복잡한 상태를 일관성 있게 관리하는 것이 중요합니다.

**에러 처리의 다층화**: 네트워크 오류, 미디어 접근 오류, 브라우저 호환성 오류 등 다양한 계층의 에러를 각각 적절히 처리해야 합니다. 사용자에게는 기술적 세부사항보다는 해결 방법을 안내하는 것이 효과적입니다.

### 7.2 성능 최적화 경험

**적응형 품질 조정**: 네트워크 상태에 따른 동적 품질 조정이 사용자 만족도에 큰 영향을 미칩니다. 특히 모바일 환경에서는 배터리 수명과 데이터 사용량을 고려한 최적화가 필수입니다.

**코덱 선택의 중요성**: VP8, VP9, H.264 등 다양한 코덱 중에서 환경에 맞는 선택이 성능에 직접적인 영향을 미칩니다. 특히 Safari의 H.264 선호도와 Chrome의 VP8/VP9 지원을 고려해야 합니다.

**메모리 관리**: MediaStream, RTCPeerConnection 등의 리소스를 적절히 해제하지 않으면 메모리 누수가 발생합니다. React의 useEffect cleanup 함수를 적극 활용해야 합니다.

### 7.3 앞으로의 발전 방향

**WebRTC NV (Next Version) 준비**: WebRTC 표준이 계속 발전하고 있으며, 새로운 기능들이 지속적으로 추가되고 있습니다. Simulcast, SVC(Scalable Video Coding), AI 기반 노이즈 캔슬링 등의 기술을 미리 준비해야 합니다.

**Edge Computing 활용**: CDN의 Edge 노드를 활용한 지연 시간 최소화와 TURN 서버의 분산 배치를 통해 글로벌 서비스 품질을 향상시킬 수 있습니다.

**AI/ML 통합**: 실시간 배경 블러, 자동 노이즈 제거, 음성 향상 등 AI 기능을 통합하여 사용자 경험을 크게 개선할 수 있습니다.

**보안 강화**: End-to-End 암호화 강화, 인증 시스템 통합, 레코딩 방지 등 보안 요구사항이 계속 증가하고 있어 이에 대한 대비가 필요합니다.

## 마무리

WebRTC를 활용한 화상 통화 서비스 개발은 기술적 복잡성이 높지만, 사용자에게 실시간 소통의 새로운 경험을 제공할 수 있는 매력적인 영역입니다. 이번 개발 경험을 통해 WebRTC의 핵심 개념부터 실제 프로덕션 환경에서의 최적화까지 전반적인 노하우를 축적할 수 있었습니다.

특히 한국의 네트워크 환경과 모바일 생태계에 특화된 최적화 경험은 국내 서비스 개발에 직접적으로 도움이 될 것입니다. 앞으로도 WebRTC 기술의 발전을 지켜보며, 더 나은 실시간 커뮤니케이션 서비스를 만들어가겠습니다.

이 글이 WebRTC 화상 통화 서비스를 개발하시는 분들께 실질적인 도움이 되기를 바랍니다. 질문이나 추가적인 논의가 필요하시면 언제든 댓글로 남겨주시기 바랍니다.
