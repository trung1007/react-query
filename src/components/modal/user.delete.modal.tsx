import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IUser } from "../../constants/type";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const UserDeleteModal = (props: any) => {
  const { dataUser, isOpenDeleteModal, setIsOpenDeleteModal } = props;

  const clientQuery = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: IUser) => {
      await fetch(`http://localhost:8000/users/${payload?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": " application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Delete success");
      handleClose();
      clientQuery.invalidateQueries({ queryKey: ["fetchUsers"] });
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      id: dataUser?.id,
    });
  };

  const handleClose = () => {
    setIsOpenDeleteModal(false);
  };

  return (
    <Modal
      show={isOpenDeleteModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop={false}
      onHide={() => setIsOpenDeleteModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete A User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Delete the user: {dataUser?.email ?? ""}</Modal.Body>
      <Modal.Footer>
        {!mutation.isPending ? (
          <>
            <Button
              variant="warning"
              onClick={() => setIsOpenDeleteModal(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit()}>Confirm</Button>
          </>
        ) : (
          <Button disabled>
            <Spinner
              animation="border"
              size="sm"
              role="status"
              as="span"
              aria-hidden="true"
            />{" "}
            <></> Deleting...
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
