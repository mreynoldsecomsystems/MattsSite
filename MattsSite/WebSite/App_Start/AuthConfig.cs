using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.WebPages.OAuth;
using WebSite.Models;

namespace WebSite
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            OAuthWebSecurity.RegisterMicrosoftClient(
                clientId: "00000000400EDD8A",
                clientSecret: "vGwNC7vBXbACxle0fmPSiIAubtjzIh2Y");

            OAuthWebSecurity.RegisterTwitterClient(
                consumerKey: "3PZspXIOqiXY2iCuYBURQ",
                consumerSecret: "vuqwAwPJ3ejwXTwNItXTmvlcOPbL1FryX4E9PpZbYo");

            OAuthWebSecurity.RegisterFacebookClient(
                appId: "219387881519116",
                appSecret: "21559bb0a1539eddab1b54e2d8594f70");

            //OAuthWebSecurity.RegisterGoogleClient();
        }
    }
}
