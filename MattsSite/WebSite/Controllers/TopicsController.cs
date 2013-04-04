using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSite.Code;

namespace WebSite.Controllers
{
    public class TopicsController : Controller
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

        public ActionResult GetTopic(string token)
        {
            var model = db.Topics.Where(t => t.TopicToken == token.ToUpper()).First();

            return View("_GetTopic", model);
        }

    }
}
