import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useSnippets } from '../../hooks';
import { actions as snippetsActions } from '../../slices/snippetsSlice.js';

function DeleteSnippetModal({ handleClose, isOpen }) {
  const { snippets } = useSelector((state) => state.snippets);
  const checkedSnippet = snippets.filter((snippet) => snippet.checkbox);
  const countChecked = checkedSnippet.length;
  const dispatch = useDispatch();
  const snippetApi = useSnippets();
  const { t } = useTranslation();

  const handleSnippetDelete = (snippetsSlice) => {
    handleClose();
    snippetsSlice.forEach(async (snippet) => {
      const { id } = snippet;
      if (snippet.checkbox) {
        try {
          await snippetApi.deleteSnippet(id);
          dispatch(snippetsActions.deleteSnippet(id));
        } catch (error) {
          if (!error.isAxiosError) {
            console.log(t('errors.unknown'));
            throw error;
          } else {
            console.log(t('errors.network'));
            throw error;
          }
        }
      }
    });
  };

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Modal.Header className="py-3" closeButton>
        <Modal.Title>
          {t('modals.deleteSnippet.title.key', { count: countChecked })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('modals.deleteSnippet.body.key', { count: countChecked })}
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-row gap-5 mt-3">
            <Button
              className="flex-fill"
              variant="secondary"
              onClick={handleClose}
            >
              {t('modals.deleteSnippet.button.cancelButton')}
            </Button>
            <Button
              className="flex-fill"
              variant="primary"
              onClick={() => handleSnippetDelete(snippets)}
            >
              {t('modals.deleteSnippet.button.okButton')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteSnippetModal;
