import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
interface Prop {
    open: boolean;
    setOpen: (val: boolean) => void;
    children: React.ReactNode
}
function Model(props: Prop) {
    return (
        <Modal open={props.open} onClose={() => props.setOpen(false)} className=' h-screen w-screen flex items-center justify-center ' >
            <div className='relative w-1/2 h-3/5 bg-slate-900 text-white rounded-3xl p-4'>
                <Button className="!absolute !top-5 !right-3" onClick={() => props.setOpen(false)}>
                    <CloseIcon className='!text-2xl' />
                </Button>
                {props.children}
            </div>
        </Modal>
    )
}

export default Model