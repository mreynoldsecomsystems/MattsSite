using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebSite.Models;

namespace WebSite.Code
{
    public class WebSiteContext : DbContext
    {
        public WebSiteContext()
            : base("name=WebSiteEntities")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            this.Configuration.ProxyCreationEnabled = false;
            if(!this.Database.Exists())
            {
                this.Database.Create();
            }
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<BlogTag> BlogTags { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserAvatar> UserAvatars { get; set; }
        public DbSet<Tag> Tags { get; set; }
    }
}