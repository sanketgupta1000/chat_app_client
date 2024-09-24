function UserModal(props) {
    return (
        <dialog id={props.id} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{props.header}</h3>
                <div className="mt-4 max-h-[50vh] overflow-y-auto">
                    {props.children}
                </div>
            </div>
        </dialog>
    );
}

export default UserModal;
