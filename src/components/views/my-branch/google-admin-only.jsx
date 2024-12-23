import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import './google-admin-only.scss';

import Config from 'src/config';

import BranchApi from 'src/apis/viviboom/BranchApi';
import Button from 'src/components/common/button/button';

function GoogleAdminOnly() {
  const { t } = useTranslation('translation', { keyPrefix: 'myBranch' });
  const { search } = useLocation();
  const history = useHistory();
  const authToken = useSelector((state) => state.user?.authToken);
  const branch = useSelector((state) => state.branch);

  const [loading, setLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(branch.adminGoogleClientId || '');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [registrationFormFolderId, setRegistrationFormFolderId] = useState(branch.registrationFormFolderId || '');

  // step 1: handle user submit client id, redirect to google oauth
  const handleSubmit = async () => {
    if (!googleClientId) return toast.error(t('Please fill up your Google client ID.'));

    if (!googleClientSecret.length) return toast.error(t('Please fill up your Google client secret.'));

    const redirectUri = `${Config.Common.AdminFrontEndUrl}/google-admin-only`; // handle code exchange

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/drive.file`;

    const requestBody = {
      authToken,
      branchId: branch.id,
      adminGoogleClientId: googleClientId,
      adminGoogleClientSecret: googleClientSecret,
      registrationFormFolderId,
    };

    if (!window.confirm(t('Are you sure you want to change the Google client ID and client secret pair?'))) return toast.error(t('Update of Google credentials cancelled.'));

    setLoading(true);
    try {
      await BranchApi.patch(requestBody);
      setLoading(false);
      window.open(authUrl, '_self');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    return setLoading(false);
  };

  // step 2: after oauth process parse code and send to server
  const sendCode = useCallback(async () => {
    const query = new URLSearchParams(search);
    // expect code or error post oauth
    const code = query.get('code');
    const error = query.get('error');
    if (error || !code) {
      if (error) toast.error(error);
      return history.replace('/my-branch');
    }
    setLoading(true);
    try {
      await BranchApi.patchAdminGoogleAuth({ authToken, branchId: branch.id, code });
      toast.success('Google credential settings updated.');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    // remove the code query params
    history.replace('/my-branch');
    return setLoading(false);
  }, [authToken, branch.id, history, search]);

  useEffect(() => {
    sendCode();
  }, [sendCode]);

  return (
    <div className="country-data-container">
      <h2>
        {t('Sync Admin Google Services')}
        {' '}
        (
        {t('Google Drive')}
        )
      </h2>

      {!!branch.gcalClientId && (
      <div className="gcal-warning">
        <h4>
          ⚠️
          {' '}
          {t('There is a set of credentials (client ID, client secret, OAuth refresh token) for this branch.')}
        </h4>
        <h4>
          ⚠️
          {' '}
          {t('Please note that if you try to submit a new pair of client ID and client secret, it will erase the existing pair!')}
        </h4>
      </div>
      )}
      <label>
        {t('Google Client ID')}
        {' '}
        (
        {t('Admin')}
        )
      </label>
      <input type="text" value={googleClientId} onChange={(e) => setGoogleClientId(e.target.value)} />
      <label>{t('Google Client Secret')}</label>
      <input type="text" value={googleClientSecret} onChange={(e) => setGoogleClientSecret(e.target.value)} />
      <label>{t('Google Drive Forder ID for User Registration Form')}</label>
      <input type="text" value={registrationFormFolderId} onChange={(e) => setRegistrationFormFolderId(e.target.value)} />

      <h5>{t("Note: if you are an Admin, you will make changes to your branch's admin-only google API integration.")}</h5>
      <div className="gcal-btn-container">
        <Button
          status={loading ? 'loading' : 'save'}
          className="gcal-btn"
          onClick={handleSubmit}
          disabled={!googleClientSecret || !googleClientId}
        >
          {t('Sync Google Credentials (Admin)')}
        </Button>
      </div>
    </div>
  );
}

export default GoogleAdminOnly;
