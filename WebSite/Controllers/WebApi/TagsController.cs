using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebSite.Models;
using WebSite.Code;

namespace WebSite.Controllers.WebApi
{
    public class TagsController : ApiController
    {
        private WebSiteContext _db;
        private WebSiteContext db
        {
            get
            {
                if (_db == null)
                    _db = new WebSiteContext();
                return _db;
            }
        }

        public IEnumerable<Tag> Get()
        {
            var tags = db.Tags;
            return tags;

        }

    }
}
