using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebMatrix.WebData;
using WebSite.Code;
using WebSite.Filters;
using WebSite.Models;

namespace WebSite.Controllers
{
    [InitializeSimpleMembership]
    public class BlogController : Controller
    {
        //
        // GET: /Blog/
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

        public ActionResult GetBlogs(int index = 0, int archive = 0)
        {
            var model = db.BlogPosts;
            return PartialView("_BlogPosts", model); 
        }

        public ActionResult BlogPost(int id)
        {
            var model = db.BlogPosts.Find(id);
            return View(model);
        }

        [HttpGet]
        public ActionResult Edit(int blogPostID)
        {

            return View();
        }

        [HttpPost]
        public ActionResult Edit(BlogPost model)
        {
            if(ModelState.IsValid)
            {

                return RedirectToAction("BlogPost", new { id = model.BlogPostID });
            }

            return View(model);
        }

        [HttpGet]
        public ActionResult NewPost()
        {

            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult NewPost(BlogPost model)
        {

            model.CreatedByID = WebSecurity.CurrentUserId;
            model.CreatedDate = DateTime.UtcNow.ToLocalTime();
            model.ModifiedByID = WebSecurity.CurrentUserId;
            model.ModifiedDate = DateTime.UtcNow.ToLocalTime();

            
                
                db.BlogPosts.Add(model);
                db.SaveChanges();
                return RedirectToAction("BlogPost", new { id = model.BlogPostID });
            

        }
    }
}
