'use client';
import { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Button, 
  Fade,
  CircularProgress 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ErrorIcon from '@mui/icons-material/Error';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicBanner = ({ music, onClose }: { music: any, onClose: () => void }) => {
  const [currentMusic, setCurrentMusic] = useState<any>(null);
  const [playerState, setPlayerState] = useState<'loading' | 'ready' | 'playing' | 'paused' | 'error'>('loading');
  const [errorType, setErrorType] = useState<'restricted' | 'unavailable' | 'unknown' | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const apiLoadedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extraer el ID del video de YouTube
  const getVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (url.includes('youtube.com/watch')) {
        return urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  };

  // Obtener URL de YouTube Music
  const getYouTubeMusicUrl = (videoId: string): string => {
    return `https://music.youtube.com/watch?v=${videoId}`;
  };

  // Cargar la API de YouTube
  useEffect(() => {
    if (!document.querySelector('#youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    const initAPI = () => {
      apiLoadedRef.current = true;
      if (currentMusic) {
        initializePlayer();
      }
    };

    if (window.YT && window.YT.Player) {
      initAPI();
    } else {
      window.onYouTubeIframeAPIReady = initAPI;
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    setCurrentMusic(music);
  }, [music])
  

  // Inicializar reproductor cuando cambia la música
  useEffect(() => {
    if (!currentMusic || !apiLoadedRef.current) return;
    initializePlayer();
  }, [currentMusic, retryCount]);

  const initializePlayer = () => {
    const videoId = getVideoId(currentMusic.url);
    if (!videoId) {
      setPlayerState('error');
      setErrorType('unavailable');
      return;
    }

    if (!playerContainerRef.current || !window.YT || !window.YT.Player) return;

    // Destruir player anterior si existe
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error('Error destroying player:', e);
      }
    }

    setPlayerState('loading');
    setErrorType(null);

    try {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: videoId,
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
          iv_load_policy: 3, // Ocultar anotaciones
          rel: 0, // No mostrar videos relacionados
          showinfo: 0 // Ocultar información del video
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    } catch (error) {
      console.error('Error creating YouTube player:', error);
      setPlayerState('error');
      setErrorType('unknown');
    }
  };

  const onPlayerReady = (event: any) => {
    console.log('YouTube Player ready');
    event.target.setVolume(volume);
    setPlayerState('ready');
    
    // Intentar reproducir
    try {
      event.target.playVideo();
    } catch (error) {
      console.log('PlayVideo error:', error);
    }
  };

  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case 1: // Reproduciendo
        setPlayerState('playing');
        break;
      case 2: // Pausado
        setPlayerState('paused');
        break;
      case 3: // Buffering
        setPlayerState('loading');
        break;
      case 0: // Terminado
        setPlayerState('paused');
        break;
    }
  };

  const onPlayerError = (event: any) => {
    console.error('YouTube Player error:', event.data);
    
    const errorCode = event.data;
    
    // Mapeo de códigos de error
    if (errorCode === 101 || errorCode === 150) {
      setErrorType('restricted');
      setPlayerState('error');
    } else if (errorCode === 100 || errorCode === 2) {
      setErrorType('unavailable');
      setPlayerState('error');
    } else {
      setErrorType('unknown');
      setPlayerState('error');
    }
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    try {
      if (playerState === 'playing') {
        playerRef.current.pauseVideo();
      } else if (playerState === 'paused' || playerState === 'ready') {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!playerRef.current) return;
    
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 50);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleClose = () => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
    setCurrentMusic(null);
    onClose();
  };

  const openInYouTubeMusic = () => {
    const videoId = getVideoId(currentMusic?.url);
    if (videoId) {
      window.open(getYouTubeMusicUrl(videoId), '_blank');
    }
  };

  if (!currentMusic) return null;

  const videoId = getVideoId(currentMusic.url);
  if (!videoId) {
    return (
      <Fade in timeout={300}>
        <Paper sx={{ 
          position: 'fixed', 
          bottom: 30, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 5000, 
          p: 2, 
          bgcolor: 'error.main', 
          color: 'white',
          borderRadius: 4,
          minWidth: '300px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ErrorIcon />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">URL inválida</Typography>
              <Typography variant="caption">{currentMusic.name}</Typography>
            </Box>
            <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in timeout={300}>
      <Paper 
        elevation={10} 
        sx={{ 
          position: 'fixed', 
          bottom: 30, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 5000,
          p: 2,
          borderRadius: 4,
          bgcolor: playerState === 'error' ? 'error.main' : 'secondary.main',
          color: 'white',
          minWidth: '350px',
          maxWidth: '450px',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Contenedor invisible del reproductor YouTube */}
        <Box 
          ref={playerContainerRef}
          sx={{ 
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
            overflow: 'hidden'
          }} 
        />

        {/* Contenido principal */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: playerState === 'error' ? 2 : 0 }}>
          {/* Icono animado */}
          {playerState === 'error' ? (
            <ErrorIcon />
          ) : (
            <MusicNoteIcon sx={{ 
              animation: playerState === 'playing' ? 'spin 3s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          )}
          
          {/* Información de la canción */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {playerState === 'error' ? '❌ Error' : 
               playerState === 'loading' ? '⏳ Cargando...' :
               playerState === 'playing' ? '▶️ Reproduciendo:' :
               playerState === 'paused' ? '⏸️ Pausado:' :
               '🎵 YouTube Audio:'}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {currentMusic.name}
            </Typography>
          </Box>

          {/* Botón cerrar */}
          <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Estado de error - con botón para YouTube Music */}
        {playerState === 'error' && errorType === 'restricted' && (
          <Fade in timeout={300}>
            <Box sx={{ 
              mt: 2, 
              pt: 2, 
              borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorIcon fontSize="small" />
                Este video no permite reproducción externa debido a restricciones del propietario.
              </Typography>
              <Button 
                fullWidth
                variant="contained" 
                onClick={openInYouTubeMusic}
                startIcon={<OpenInNewIcon />}
                endIcon={<MusicNoteIcon />}
                sx={{ 
                  bgcolor: 'white',
                  color: 'error.main',
                  fontWeight: 'bold',
                  '&:hover': { 
                    bgcolor: '#f0f0f0',
                    transform: 'scale(1.02)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Abrir en YouTube Music
              </Button>
              <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.7 }}>
                La aplicación de YouTube Music se abrirá automáticamente
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Error general */}
        {playerState === 'error' && errorType !== 'restricted' && (
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            gap: 1
          }}>
            <Typography variant="body2">
              {errorType === 'unavailable' 
                ? 'Este video no está disponible (eliminado o privado).' 
                : 'Error inesperado al reproducir.'}
            </Typography>
            <Button 
              size="small"
              variant="text" 
              onClick={handleRetry}
              sx={{ color: 'white', textDecoration: 'underline' }}
            >
              Reintentar
            </Button>
          </Box>
        )}

        {/* Controles de reproducción (solo si no hay error) */}
        {playerState !== 'error' && (
          <Fade in timeout={300}>
            <Box sx={{ 
              mt: 2, 
              pt: 2, 
              borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {/* Botón play/pausa */}
              <IconButton 
                size="small" 
                onClick={handlePlayPause}
                sx={{ color: 'white' }}
                disabled={playerState === 'loading'}
              >
                {playerState === 'loading' ? (
                  <CircularProgress size={20} color="inherit" />
                ) : playerState === 'playing' ? (
                  <PauseIcon />
                ) : (
                  <PlayArrowIcon />
                )}
              </IconButton>

              {/* Control de volumen */}
              <IconButton size="small" onClick={handleMute} sx={{ color: 'white' }}>
                {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              
              <Box sx={{ flexGrow: 1, px: 1 }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(255,255,255,0.3)',
                    outline: 'none'
                  }}
                />
              </Box>

              {/* Badge de estado */}
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {playerState === 'playing' ? 'Sonando' : 
                 playerState === 'loading' ? 'Cargando' : 'Pausado'}
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Enlace directo a YouTube (opcional) */}
        {playerState !== 'error' && (
          <Typography variant="caption" sx={{ 
            display: 'block', 
            mt: 1, 
            opacity: 0.5,
            textAlign: 'right'
          }}>
            <a 
              href={`https://youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Ver en YouTube ↗
            </a>
          </Typography>
        )}
      </Paper>
    </Fade>
  );
};