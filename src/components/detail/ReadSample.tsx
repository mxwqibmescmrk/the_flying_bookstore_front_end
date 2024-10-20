import * as React from 'react';
import Button from '@mui/material/Button';
import { CiZoomOut } from "react-icons/ci";
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IListing } from '../../types/book';
import Image from 'next/image';
import { IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CiZoomIn } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { ZoomOutSharp } from '@mui/icons-material';

export interface ISampleDialog {
  open: boolean
  book: IListing | undefined
}

const ReadSampleDialog = ({ sampleDialog, setSampleDialog }: { sampleDialog: ISampleDialog, setSampleDialog: React.Dispatch<React.SetStateAction<ISampleDialog>> }) => {
  const [zoom, setZoom] = React.useState({
    width: 774,
    height: 1000,
    disableZoomIn: false,
    disableZoomOut: false,
  })
  const handleClose = () => {
    setSampleDialog(state => ({ ...state, open: false }))
  };
  const handleZoomIn = () => {
 if (zoom.width < 1000) {
      setZoom(state => ({ ...state, width: state.width + 100, height: state.height + 200, disableZoomIn: false, disableZoomOut:false }));
    } else {
      setZoom(state => ({ ...state, disableZoomIn: true , disableZoomOut: false}))
    }
  }
  const handleZoomOut = () => {
 if (zoom.width > 500) {
      setZoom(state => ({ ...state, width: state.width - 100, height: state.height - 200, disableZoomOut: false, disableZoomIn:false }));
    } else {
      setZoom(state => ({ ...state, disableZoomOut: true, disableZoomIn: false }))
    }
  }

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (sampleDialog.open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [sampleDialog.open]);

  return (
    <React.Fragment>
      <Dialog
        open={sampleDialog.open}
        onClose={handleClose}
        scroll={'paper'}
        fullWidth={true}
        maxWidth={'lg'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Stack
          direction="row"
          sx={{
            mx: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="back"
            onClick={handleClose}
            sx={(theme) => ({
              color: theme.palette.grey[500],
            })}
          >
            <IoIosArrowBack />
          </IconButton>
          <DialogTitle id="scroll-dialog-title" sx={{ textAlign: 'center' }}>Xem trước cuốn sách {sampleDialog.book?.book?.title}</DialogTitle>
          <div>
            <IconButton
              aria-label="zoom-out"
              onClick={handleZoomOut}
              disabled={zoom.disableZoomOut}
              sx={(theme) => ({
              })}
            >
              <CiZoomOut />
            </IconButton>
            <IconButton
              aria-label="zoom-in"
              onClick={handleZoomIn}
              disabled={zoom.disableZoomIn}
              sx={(theme) => ({
              })}
            >
              <CiZoomIn />
            </IconButton>
          </div>
        </Stack>
        <DialogContent dividers={true}>
          <DialogContentText
            sx={{}}
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div className='flex flex-col items-center'>
              {listImgPreview.map((src, key) => (<Image className="object-contain" alt={sampleDialog.book?.book.title || "sách"} src={src} key={key} width={zoom.width} height={zoom.height} />))}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
const listImgPreview = [
  "https://i.ibb.co/t8RQwC9/page1.jpg",
  "https://i.ibb.co/BwGHJfK/page2.jpg",
  "https://i.ibb.co/SVy6BD7/page3.jpg",
  "https://i.ibb.co/yYCpMdd/page4.jpg",
  "https://i.ibb.co/K9jqcby/page5.jpg",

]
export default ReadSampleDialog