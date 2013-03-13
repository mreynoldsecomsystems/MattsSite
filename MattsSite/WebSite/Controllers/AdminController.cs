using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSite.Code;
using WebSite.Models;

namespace WebSite.Controllers
{
    //[Authorize(Users = "mattR")]
    public class AdminController : Controller
    {
        //
        // GET: /Admin/

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

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Topics()
        {
            var model = db.Topics;
            return View(model);
        }

        public ActionResult Topic(int id)
        {
            var model = db.Topics.Find(id);

            return View(model);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Topic(Topic model)
        {
            if(ModelState.IsValid)
            {
                db.Entry(model).State = System.Data.EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Topics");
            }
            return View(model);
        }

        public ActionResult NewTopic()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult NewTopic(Topic model)
        {
            if(ModelState.IsValid)
            {
                db.Topics.Add(model);
                return RedirectToAction("Topic", new { id = model.TopicID });
            }

            return View();

        }
             
    }
}
