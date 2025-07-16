/** React Imports */
import { useState } from 'react'

/** MUI Imports */
import { Typography, Box, Snackbar, Alert } from '@mui/material'
import { AttachFile } from '@mui/icons-material'

/** Third Party Imports */
import { useDropzone } from 'react-dropzone'

type TProps = {
  onUpload: (file: File) => void
}

const Uploader = (props: TProps) => {
  /** Props */
  const { onUpload } = props

  /** States */
  const [snackBarState, setSnackBarState] = useState({ open: false, messages: '' })

  /** Hooks */
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 512000,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpeg']
    },
    onDrop: (acceptedFiles: File[]) => {
      onUpload(acceptedFiles[0])
    },
    onDropRejected: error => {
      const message = error[0].errors[0].message.includes('File is larger')
        ? 'File is larger than 500kb'
        : error[0].errors[0].message

      setSnackBarState({
        open: false,
        messages: message
      })
    }
  })

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: '41px',
            gap: '10px',
            backgroundColor: '#EBEBEB',
            borderRadius: '4px'
          }}
        >
          <AttachFile />
          <div style={{ fontWeight: 500, fontSize: '16px' }}>
            Drag and drop file(s) here or click{' '}
            <span style={{ color: '#3dccfa', textDecoration: 'underline', cursor: 'pointer' }}>browse</span> to upload
          </div>
          <Typography variant='caption'>Support formats: png, jpg, jpeg</Typography>
          <Typography variant='caption'>And Max. File Size 500Kb</Typography>
        </Box>
      </div>
      <Snackbar
        open={snackBarState.open}
        autoHideDuration={6000}
        onClose={() => setSnackBarState({ messages: '', open: false })}
      >
        <Alert
          onClose={() => setSnackBarState({ messages: '', open: false })}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackBarState.messages}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Uploader
