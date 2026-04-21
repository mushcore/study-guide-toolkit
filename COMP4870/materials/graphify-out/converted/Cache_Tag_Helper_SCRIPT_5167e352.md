<!-- converted from Cache_Tag_Helper_SCRIPT.docx -->

# <cache> Tag Helper
Expire after 5 seconds:
<cache expires-after="@TimeSpan.FromSeconds(5)">
<!--View Component that gets data from somewhere-->
*last updated  @DateTime.Now.ToLongTimeString()
</cache>
Expire at the end of the day:
<cache expires-on="@DateTime.Today.AddDays(1).AddTicks(-1)">
<!--View Component or that gets data from the database-->
*last updated  @DateTime.Now.ToLongTimeString()
</cache>
## expires-sliding
Use the expires-sliding attribute to expire the cache entry after it has not been accessed for a specified amount of time. This attribute expects a TimeSpan value.
<cache expires-sliding="@TimeSpan.FromMinutes(5)">
<!--View Component that gets data from somewhere-->
*last updated  @DateTime.Now.ToLongTimeString()
</cache>
## vary-by
## Combinations of vary-by
<cache vary-by-user="true" vary-by-route="id">
<!--View Component that gets data from somewhere-->
*last updated  @DateTime.Now.ToLongTimeString()
</cache>
## Cache Priority
Possible values for CacheItemPriority are Low, Normal, High and NeverRemove.
@using Microsoft.Extensions.Caching.Memory
<cache vary-by-user="true"
priority="@CacheItemPriority.Low">
<!--View Component that gets data from somewhere-->
*last updated  @DateTime.Now.ToLongTimeString()
</cache>

A good candidate for caching
<footer>
<cache expires-after="@TimeSpan.FromDays(30)">
<p>
&copy; Copyright @DateTime.Now.Year - Super Site -
Powered by @System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription
</p>
</cache>
</footer>
## Limitations:
- Anything that causes the host process to shutdown / restart will cause a full loss of all entries in the cache. Examples: restarting an IIS App Pool OR scaling down an Azure instance
- The MemoryCache is not a distributed cache. You might get strange & unexpected results in a load balanced deployment scenario. Solution: Ensure that a specific client’s requests are always routed to the same server

|  | Example |
| --- | --- |
| vary-by-user | <cache vary-by-user="true"> . . . </cache> |
| vary-by-route | <cache vary-by-route="id"> . . . </cache>
1st: http://localhost:64643/home/index/11
2nd: http://localhost:64643/home/index/12 |
| vary-by-query | <cache vary-by-query="search"> . . . </cache>
1st: http://localhost:64643/?search=aaa
2nd: http://localhost:64643/?search=bbb |
| vary-by-cookie | <cache vary-by-cookie="MyAppCookie"> . . . </cache> |
| vary-by-header | <cache vary-by-header="User-Agent"> . . . </cache> |
| vary-by | <cache vary-by="@ViewBag.ProductId"> . . . </cache> |