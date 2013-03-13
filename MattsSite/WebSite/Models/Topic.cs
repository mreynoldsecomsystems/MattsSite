using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebSite.Models
{
    public class Topic
    {
        [Key]
        public int TopicID { get; set; }
        public string TopicToken { get; set; }
        public string TopicName { get; set; }
        [DataType(DataType.Html)]
        public string Body { get; set; }
    }
}